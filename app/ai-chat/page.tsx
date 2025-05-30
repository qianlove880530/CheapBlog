"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar } from "@/components/ui/avatar"
import {
  Bot,
  User,
  Send,
  Loader2,
  RefreshCw,
  Search,
  FileText,
  Sparkles,
  History,
  Globe,
  AlertTriangle,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PromptSelector from "@/components/ai/prompt-selector"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { useLanguage } from "@/components/i18n/language-provider"

interface Message {
  id: string
  role: "user" | "assistant" | "system" | "tool"
  content: string
  model?: string
  isStreaming?: boolean
  toolName?: string
  toolResults?: any
}

// 提示词类型
interface Prompt {
  id: string
  name: string
  content: string
  category_id: string
  category?: {
    id: string
    name: string
  }
  description: string
}

// 搜索工具类型
interface SearchTool {
  id: string
  name: string
  description: string
  enabled: boolean
}

// 知识库类型
interface KnowledgeBase {
  id: string
  name: string
  files: {
    id: string
    name: string
    description: string
  }[]
}

// OpenRouter模型配置
interface AIModel {
  id: string
  name: string
  provider: string
  description: string
  color: string
}

// Tavily搜索结果类型
interface TavilySearchResult {
  answer?: string
  results: Array<{
    title: string
    url: string
    content: string
    score: number
    published_date?: string
  }>
}

// 生成唯一ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}

// 最大重试次数
const MAX_RETRIES = 2
// 重试延迟（毫秒）
const RETRY_DELAY = 1000
// 响应超时（毫秒）
const RESPONSE_TIMEOUT = 20000

export default function AIChatPage() {
  const { language } = useLanguage()

  // 翻译函数
  const t = (zh: string, en: string) => (language === "en" ? en : zh)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: "assistant",
      content: t(
        "你好！我是AI万能助手。我可以帮你解答问题，请选择左侧我可以使用的工具哟。",
        "Hello! I'm your AI Assistant. I can help answer your questions. Please select the tools I can use from the left panel.",
      ),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [contextLength, setContextLength] = useState(10)
  const [searchError, setSearchError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  // 功能状态
  const [activeTab, setActiveTab] = useState("prompts")
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [searchTools, setSearchTools] = useState<SearchTool[]>([
    {
      id: "tavily",
      name: t("Tavily搜索", "Tavily Search"),
      description: t(
        "使用Tavily API进行网络搜索，获取最新信息",
        "Use Tavily API for web search to get the latest information",
      ),
      enabled: false,
    },
    {
      id: "academic",
      name: t("学术搜索", "Academic Search"),
      description: t(
        "专注于学术论文和研究资料的搜索工具",
        "Search tool focused on academic papers and research materials",
      ),
      enabled: false,
    },
    {
      id: "news",
      name: t("新闻搜索", "News Search"),
      description: t("专注于最新新闻和时事的搜索工具", "Search tool focused on latest news and current events"),
      enabled: false,
    },
  ])
  const [activeKnowledgeFile, setActiveKnowledgeFile] = useState<string | null>(null)
  const [selectedLLM, setSelectedLLM] = useState("tngtech/deepseek-r1t-chimera:free")

  // OpenRouter模型列表
  const aiModels: AIModel[] = [
    {
      id: "google/gemini-2.0-flash-exp:free",
      name: "Gemini 2.0 Flash",
      provider: "Google",
      description: t("快速响应模型", "Fast response model"),
      color: "red",
    },
    {
      id: "tngtech/deepseek-r1t-chimera:free",
      name: "DeepSeek R1T Chimera",
      provider: "TNG Tech",
      description: t("默认模型", "Default model"),
      color: "green",
    },
    {
      id: "arliai/qwq-32b-arliai-rpr-v1:free",
      name: "QWQ 32B",
      provider: "Arli AI",
      description: t("高性能通用模型", "High-performance general model"),
      color: "blue",
    },
    {
      id: "nvidia/llama-3.1-nemotron-ultra-253b-v1:free",
      name: "Llama 3.1 Nemotron Ultra 253B",
      provider: "NVIDIA",
      description: t("超大规模模型", "Ultra-large scale model"),
      color: "purple",
    },
    {
      id: "meta-llama/llama-4-maverick:free",
      name: "Llama 4 Maverick",
      provider: "Meta",
      description: t("最新Llama系列模型", "Latest Llama series model"),
      color: "indigo",
    },
  ]

  const knowledgeBases = [
    {
      id: "kb1",
      name: t("AI基础知识", "AI Fundamentals"),
      files: [
        {
          id: "f1",
          name: t("机器学习基础", "Machine Learning Basics"),
          description: t("包含机器学习的核心概念和算法", "Core concepts and algorithms of machine learning"),
        },
        {
          id: "f2",
          name: t("深度学习入门", "Deep Learning Introduction"),
          description: t("神经网络和深度学习的基础知识", "Fundamentals of neural networks and deep learning"),
        },
        {
          id: "f3",
          name: t("NLP技术概览", "NLP Technology Overview"),
          description: t(
            "自然语言处理的主要技术和应用",
            "Main technologies and applications of natural language processing",
          ),
        },
      ],
    },
    {
      id: "kb2",
      name: t("编程指南", "Programming Guide"),
      files: [
        {
          id: "f4",
          name: t("Python编程", "Python Programming"),
          description: t("Python语言的基础知识和最佳实践", "Python language basics and best practices"),
        },
        {
          id: "f5",
          name: t("JavaScript指南", "JavaScript Guide"),
          description: t("JavaScript和前端开发的核心概念", "Core concepts of JavaScript and frontend development"),
        },
        {
          id: "f6",
          name: t("数据结构与算法", "Data Structures and Algorithms"),
          description: t(
            "常见数据结构和算法的实现和应用",
            "Implementation and application of common data structures and algorithms",
          ),
        },
      ],
    },
  ]

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 清理函数 - 组件卸载时中止所有请求
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // 执行Tavily搜索
  const performTavilySearch = async (query: string): Promise<TavilySearchResult | null> => {
    try {
      setSearchLoading(true)
      setSearchError(null)

      const response = await fetch("/api/tavily", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          search_depth: "advanced",
          max_results: 5,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error(t("Tavily API错误:", "Tavily API error:"), errorData)
        throw new Error(errorData.error?.detail?.error || errorData.error || t("搜索请求失败", "Search request failed"))
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error(t("Tavily搜索错误:", "Tavily search error:"), error)
      setSearchError(
        error instanceof Error ? error.message : t("搜索过程中发生错误", "An error occurred during the search"),
      )

      // 如果是API密钥错误，提供更明确的错误信息
      if (error instanceof Error && error.message.includes("Unauthorized")) {
        setSearchError(
          t(
            "搜索API密钥无效或缺失，请联系管理员",
            "Search API key is invalid or missing, please contact the administrator",
          ),
        )
      }

      return null
    } finally {
      setSearchLoading(false)
    }
  }

  // 格式化搜索结果为Markdown
  const formatSearchResults = (results: TavilySearchResult): string => {
    if (!results) return t("搜索未返回任何结果。", "The search did not return any results.")

    let markdown = t("### 搜索结果\n\n", "### Search Results\n\n")

    if (results.answer) {
      markdown += t(`**摘要**: ${results.answer}\n\n`, `**Summary**: ${results.answer}\n\n`)
    }

    markdown += t("**详细信息**:\n\n", "**Details**:\n\n")

    results.results.forEach((result, index) => {
      markdown += `${index + 1}. **[${result.title}](${result.url})**\n`
      if (result.published_date) {
        markdown += t(`   发布日期: ${result.published_date}\n`, `   Published date: ${result.published_date}\n`)
      }
      markdown += `   ${result.content.substring(0, 200)}...\n\n`
    })

    return markdown
  }

  // 准备消息格式
  const prepareMessages = useCallback(
    (
      userInput: string,
      messageHistory: Message[],
      systemPromptText: string,
      toolMsgs: Message[] = [],
      assistantMessageId: string,
      maxContext: number,
    ) => {
      // 准备对话历史 - 获取最近的消息（不包括刚刚添加的空助手消息）
      const recentMessages = messageHistory
        .filter((msg) => msg.id !== assistantMessageId) // 排除刚添加的空助手消息
        .slice(-maxContext) // 获取最近的contextLength条消息

      // 格式化消息历史为API所需格式
      const formattedMessages = []

      // 首先添加系统消息
      formattedMessages.push({
        role: "system",
        content: systemPromptText,
      })

      // 然后添加对话历史
      recentMessages.forEach((msg) => {
        // 跳过系统消息，因为我们已经添加了一个系统消息
        if (msg.role === "system") return

        // 确保只包含OpenRouter API支持的角色类型
        const role = ["user", "assistant", "tool"].includes(msg.role) ? msg.role : "user"

        // 基本消息结构
        const formattedMsg: any = {
          role: role,
          content: msg.content || " ", // 确保内容不为空
        }

        // 如果是工具消息，添加name属性
        if (msg.toolName && role === "tool") {
          formattedMsg.name = msg.toolName
        }

        formattedMessages.push(formattedMsg)
      })

      // 添加当前用户消息
      formattedMessages.push({
        role: "user",
        content: userInput || " ", // 确保内容不为空
      })

      // 添加工具消息（如果有）
      if (toolMsgs.length > 0) {
        toolMsgs.forEach((toolMsg) => {
          formattedMessages.push({
            role: "tool",
            content: toolMsg.content || " ", // 确保内容不为空
            name: toolMsg.toolName || "unknown_tool",
          })
        })
      }

      return formattedMessages
    },
    [],
  )

  // 处理流式响应
  const handleStreamResponse = useCallback(
    async (
      response: Response,
      signal: AbortSignal,
      assistantMessageId: string,
      selectedModel: string,
      setMessagesFn: React.Dispatch<React.SetStateAction<Message[]>>,
    ) => {
      if (!response.body) {
        throw new Error(t("响应体为空", "Response body is empty"))
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let done = false
      let accumulatedText = ""
      let modelUsed = selectedModel
      let hasReceivedContent = false
      let responseStartTime = Date.now()
      let lastActivityTime = Date.now()

      try {
        while (!done) {
          // 检查是否已中止
          if (signal.aborted) {
            console.log(t("请求已中止", "Request aborted"))
            break
          }

          // 检查是否超时
          const currentTime = Date.now()
          if (currentTime - lastActivityTime > RESPONSE_TIMEOUT) {
            console.log(t("响应超时，未收到更新", "Response timeout, no updates received"))
            break
          }

          const { value, done: doneReading } = await reader.read()
          done = doneReading

          if (done) break

          // 更新最后活动时间
          lastActivityTime = Date.now()

          // 解码收到的数据
          const chunk = decoder.decode(value, { stream: true })

          // 处理SSE格式的数据
          const lines = chunk.split("\n").filter((line) => line.trim() !== "")

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(5).trim()

              // 检查是否是结束标记
              if (data === "[DONE]") {
                console.log(t("收到流式响应结束标记", "Received streaming response end marker"))
                continue
              }

              try {
                // 只有当数据不是 [DONE] 时才尝试解析 JSON
                const parsed = JSON.parse(data)

                // 提取模型信息（如果有）
                if (parsed.model) {
                  modelUsed = parsed.model
                }

                // 提取文本内容
                if (parsed.choices && parsed.choices[0]?.delta?.content) {
                  const textChunk = parsed.choices[0].delta.content
                  accumulatedText += textChunk
                  hasReceivedContent = true
                  responseStartTime = Date.now() // 重置超时计时器

                  // 更新消息内容，模拟打字效果
                  setMessagesFn((prev) => {
                    const newMessages = [...prev]
                    const assistantMessageIndex = newMessages.findIndex((msg) => msg.id === assistantMessageId)

                    if (assistantMessageIndex !== -1) {
                      newMessages[assistantMessageIndex] = {
                        ...newMessages[assistantMessageIndex],
                        content: accumulatedText,
                        model: modelUsed,
                      }
                    }
                    return newMessages
                  })
                }
              } catch (e) {
                console.error(t("解析SSE数据失败:", "Failed to parse SSE data:"), e, t("原始数据:", "Raw data:"), data)
                // 不中断流程，继续处理下一行
              }
            }
          }

          // 检查是否超时未收到内容
          if (!hasReceivedContent && Date.now() - responseStartTime > RESPONSE_TIMEOUT) {
            console.log(t("响应超时，未收到内容", "Response timeout, no content received"))
            break
          }
        }

        // 流式响应结束，更新消息状态
        setMessagesFn((prev) => {
          const newMessages = [...prev]
          const assistantMessageIndex = newMessages.findIndex((msg) => msg.id === assistantMessageId)

          if (assistantMessageIndex !== -1) {
            newMessages[assistantMessageIndex] = {
              ...newMessages[assistantMessageIndex],
              isStreaming: false,
              model: modelUsed,
              // 如果没有收到任何内容，添加一个默认消息
              content:
                hasReceivedContent && newMessages[assistantMessageIndex].content
                  ? newMessages[assistantMessageIndex].content
                  : t(
                      "我已经收到了您的问题，但目前无法生成回答。请尝试重新提问或选择其他模型。",
                      "I've received your question, but I'm unable to generate an answer at the moment. Please try asking again or select a different model.",
                    ),
            }
          }
          return newMessages
        })

        return { success: true, hasContent: hasReceivedContent, model: modelUsed }
      } catch (error) {
        console.error(t("流式响应处理错误:", "Streaming response processing error:"), error)
        throw error
      }
    },
    [],
  )

  // 发送API请求
  const sendApiRequest = useCallback(
    async (formattedMessages: any[], model: string, signal: AbortSignal, retryAttempt = 0): Promise<Response> => {
      try {
        console.log(
          t(
            `发送API请求 (尝试 ${retryAttempt + 1}/${MAX_RETRIES + 1})`,
            `Sending API request (attempt ${retryAttempt + 1}/${MAX_RETRIES + 1})`,
          ),
        )
        console.log(t("使用模型:", "Using model:"), model)
        console.log(t("消息数量:", "Message count:"), formattedMessages.length)

        const response = await fetch("/api/openrouter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: formattedMessages,
            temperature: 0.7,
            maxTokens: 2000,
            model: model,
            stream: true,
          }),
          signal,
        })

        if (!response.ok) {
          const errorText = await response.text().catch(() => t("无法获取错误详情", "Unable to get error details"))
          console.error(
            t(
              `API请求失败 (${response.status}): ${errorText}`,
              `API request failed (${response.status}): ${errorText}`,
            ),
          )

          // 如果还有重试次数，并且不是因为中止而失败
          if (retryAttempt < MAX_RETRIES && !signal.aborted) {
            console.log(t(`等待 ${RETRY_DELAY}ms 后重试...`, `Waiting ${RETRY_DELAY}ms before retrying...`))
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
            return sendApiRequest(formattedMessages, model, signal, retryAttempt + 1)
          }

          throw new Error(
            t(
              `API请求失败: ${response.status} ${response.statusText}`,
              `API request failed: ${response.status} ${response.statusText}`,
            ),
          )
        }

        return response
      } catch (error) {
        // 如果是中止错误，直接抛出
        if (error instanceof DOMException && error.name === "AbortError") {
          throw error
        }

        // 如果还有重试次数，并且不是因为中止而失败
        if (retryAttempt < MAX_RETRIES && !signal.aborted) {
          console.log(
            t(
              `请求错误，等待 ${RETRY_DELAY}ms 后重试...`,
              `Request error, waiting ${RETRY_DELAY}ms before retrying...`,
            ),
          )
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
          return sendApiRequest(formattedMessages, model, signal, retryAttempt + 1)
        }

        throw error
      }
    },
    [],
  )

  // 处理发送消息
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    // 清除之前的错误
    setApiError(null)
    setSearchError(null)
    setRetryCount(0)

    // 如果有正在进行的请求，先中止它
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // 创建新的AbortController
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    // 添加用户消息
    const userMessageId = generateId()
    const userMessage: Message = { id: userMessageId, role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // 检查是否需要执行搜索
      const tavilyEnabled = searchTools.find((tool) => tool.id === "tavily")?.enabled || false

      let searchResults: TavilySearchResult | null = null
      let toolMessages: Message[] = []

      // 如果启用了Tavily搜索，执行搜索
      if (tavilyEnabled) {
        // 添加搜索中的消息
        const searchMessageId = generateId()
        setMessages((prev) => [
          ...prev,
          {
            id: searchMessageId,
            role: "tool",
            toolName: "tavily_search",
            content: t("正在搜索相关信息...", "Searching for relevant information..."),
            isStreaming: true,
          },
        ])

        // 执行搜索
        searchResults = await performTavilySearch(input)

        if (searchResults) {
          // 更新搜索消息
          setMessages((prev) => {
            const newMessages = [...prev]
            const searchMessageIndex = newMessages.findIndex(
              (msg) => msg.id === searchMessageId && msg.role === "tool" && msg.toolName === "tavily_search",
            )

            if (searchMessageIndex !== -1) {
              newMessages[searchMessageIndex] = {
                ...newMessages[searchMessageIndex],
                content: formatSearchResults(searchResults!),
                isStreaming: false,
                toolResults: searchResults,
              }
            }
            return newMessages
          })

          // 添加工具消息到历史
          toolMessages = [
            {
              id: generateId(),
              role: "tool",
              toolName: "tavily_search",
              content: formatSearchResults(searchResults),
              toolResults: searchResults,
            },
          ]
        } else {
          // 更新搜索消息为错误
          setMessages((prev) => {
            const newMessages = [...prev]
            const searchMessageIndex = newMessages.findIndex(
              (msg) => msg.id === searchMessageId && msg.role === "tool" && msg.toolName === "tavily_search",
            )

            if (searchMessageIndex !== -1) {
              newMessages[searchMessageIndex] = {
                ...newMessages[searchMessageIndex],
                content: t(
                  "搜索过程中发生错误，无法获取结果。",
                  "An error occurred during the search, unable to get results.",
                ),
                isStreaming: false,
              }
            }
            return newMessages
          })

          // 添加错误消息到工具消息
          toolMessages = [
            {
              id: generateId(),
              role: "tool",
              toolName: "tavily_search",
              content: t(
                "搜索过程中发生错误，无法获取结果。",
                "An error occurred during the search, unable to get results.",
              ),
            },
          ]
        }
      }

      // 添加空的助手消息作为占位符，标记为正在流式输出
      const assistantMessageId = generateId()
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        isStreaming: true,
        model: selectedLLM,
      }
      setMessages((prev) => [...prev, assistantMessage])

      // 构建系统提示
      let systemPrompt = ""
      if (selectedPrompt) {
        systemPrompt = selectedPrompt.content
      } else {
        // 如果没有选择提示词，添加一个默认的系统提示
        systemPrompt = t(
          "你是一个有用的AI助手，请用简洁、准确、友好的方式回答用户的问题。",
          "You are a helpful AI assistant. Please answer the user's questions in a concise, accurate, and friendly manner.",
        )
      }

      // 如果启用了搜索工具，添加搜索工具说明
      if (tavilyEnabled) {
        systemPrompt += t(
          `\n\n你有权访问搜索工具，可以获取最新信息。搜索结果已经提供给你，请基于这些信息回答用户的问题。
请确保引用搜索结果中的信息，并告诉用户信息来源于网络搜索。如果搜索结果不相关或不足以回答问题，请坦诚告知。`,
          `\n\nYou have access to search tools to get the latest information. Search results have been provided to you, please answer the user's question based on this information.
Please make sure to cite information from the search results and tell the user that the information comes from web search. If the search results are irrelevant or insufficient to answer the question, please be honest about it.`,
        )
      }

      // 准备消息格式
      const formattedMessages = prepareMessages(
        input,
        messages,
        systemPrompt,
        toolMessages,
        assistantMessageId,
        contextLength,
      )

      // 发送API请求
      const response = await sendApiRequest(formattedMessages, selectedLLM, signal)

      // 处理流式响应
      const result = await handleStreamResponse(response, signal, assistantMessageId, selectedLLM, setMessages)

      console.log(t("流式响应完成:", "Streaming response completed:"), result)

      // 如果没有收到内容，可能需要重试
      if (!result.hasContent && retryCount < MAX_RETRIES) {
        setRetryCount((prev) => prev + 1)
        console.log(
          t(
            `未收到内容，尝试重试 (${retryCount + 1}/${MAX_RETRIES})`,
            `No content received, trying to retry (${retryCount + 1}/${MAX_RETRIES})`,
          ),
        )
        // 这里可以添加重试逻辑
      }
    } catch (error) {
      // 检查是否是中止错误
      if (error instanceof DOMException && error.name === "AbortError") {
        console.log(t("请求被用户中止", "Request aborted by user"))
        return
      }

      console.error(t("发送消息错误:", "Error sending message:"), error)

      // 设置API错误
      setApiError(
        error instanceof Error
          ? error.message
          : t("处理请求时发生未知错误", "An unknown error occurred while processing the request"),
      )

      // 添加错误消息
      setMessages((prev) => {
        const newMessages = [...prev]
        const assistantMessageIndex = newMessages.findIndex((msg) => msg.role === "assistant" && msg.isStreaming)

        if (assistantMessageIndex !== -1) {
          newMessages[assistantMessageIndex] = {
            ...newMessages[assistantMessageIndex],
            content: t(
              "抱歉，处理您的请求时出现了错误。请稍后再试或尝试其他模型。",
              "Sorry, an error occurred while processing your request. Please try again later or try another model.",
            ),
            isStreaming: false,
          }
        }
        return newMessages
      })
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  // 切换搜索工具
  const toggleSearchTool = (toolId: string) => {
    setSearchTools((prev) => prev.map((tool) => (tool.id === toolId ? { ...tool, enabled: !tool.enabled } : tool)))
  }

  // 切换知识库文件
  const toggleKnowledgeFile = (fileId: string) => {
    setActiveKnowledgeFile((prev) => (prev === fileId ? null : fileId))
  }

  // 处理按键事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // 处理提示词选择
  const handleSelectPrompt = (prompt: Prompt | null) => {
    setSelectedPrompt(prompt)
  }

  // 清空对话历史
  const clearChat = () => {
    // 如果有正在进行的请求，先中止它
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }

    setMessages([
      {
        id: generateId(),
        role: "assistant",
        content: t(
          "你好！我是AI万能助手。我可以帮你解答问题，请选择左侧我可以使用的工具哟。",
          "Hello! I'm your AI Assistant. I can help answer your questions. Please select the tools I can use from the left panel.",
        ),
      },
    ])
    setIsLoading(false)
    setApiError(null)
    setSearchError(null)
    setRetryCount(0)
  }

  // 计算当前对话中的消息数量（不包括初始欢迎消息）
  const currentContextCount = messages.length > 1 ? messages.length - 1 : 0

  // 获取启用的搜索工具
  const enabledSearchTools = searchTools.filter((tool) => tool.enabled)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">
        {t("AI万能助手", "AI Universal Assistant")}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* 左侧功能导航 */}
        <div className="md:col-span-1">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full rounded-none grid grid-cols-3">
              <TabsTrigger value="prompts" className="rounded-none">
                <Sparkles className="h-4 w-4 mr-2" />
                {t("提示词", "Prompts")}
              </TabsTrigger>
              <TabsTrigger value="search" className="rounded-none">
                <Search className="h-4 w-4 mr-2" />
                {t("搜索", "Search")}
              </TabsTrigger>
              <TabsTrigger value="knowledge" className="rounded-none">
                <FileText className="h-4 w-4 mr-2" />
                {t("知识库", "Knowledge")}
              </TabsTrigger>
            </TabsList>

            {/* 提示词面板 */}
            <TabsContent value="prompts">
              <PromptSelector onSelectPrompt={handleSelectPrompt} selectedPromptId={selectedPrompt?.id || null} />
            </TabsContent>

            {/* 搜索工具面板 */}
            <TabsContent value="search">
              <Card className="rounded-xl shadow-md">
                <CardHeader className="pb-3 bg-gradient-to-r from-amber-100 to-yellow-100">
                  <CardTitle className="text-amber-800">{t("搜索工具", "Search Tools")}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-2">
                  {searchTools.map((tool) => (
                    <div key={tool.id} className="border rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{tool.name}</h3>
                          <p className="text-xs text-muted-foreground">{tool.description}</p>
                        </div>
                        <Switch checked={tool.enabled} onCheckedChange={() => toggleSearchTool(tool.id)} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 知识库面板 */}
            <TabsContent value="knowledge">
              <Card className="rounded-xl shadow-md">
                <CardHeader className="pb-3 bg-gradient-to-r from-amber-100 to-teal-100">
                  <CardTitle className="text-amber-800">{t("知识库", "Knowledge Base")}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-2">
                  {knowledgeBases.map((kb) => (
                    <div key={kb.id} className="border rounded-md overflow-hidden">
                      <button className="w-full flex items-center justify-between p-2 bg-amber-50 hover:bg-amber-100 text-left">
                        <span className="font-medium">{kb.name}</span>
                      </button>

                      <div className="p-2 space-y-2">
                        {kb.files.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100"
                          >
                            <div>
                              <span className="text-sm font-medium">{file.name}</span>
                              <p className="text-xs text-muted-foreground">{file.description}</p>
                            </div>
                            <Switch
                              checked={activeKnowledgeFile === file.id}
                              onCheckedChange={() => toggleKnowledgeFile(file.id)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* 当前活动功能状态卡片 */}
          <Card className="rounded-xl shadow-md mt-4">
            <CardHeader className="pb-3 bg-gradient-to-r from-green-100 to-teal-100">
              <CardTitle className="text-green-800">{t("启用工具", "Enabled Tools")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="space-y-2 text-sm">
                {selectedPrompt && (
                  <div className="p-2 bg-amber-50 rounded-md">
                    <div className="font-medium flex items-center">
                      <Sparkles className="h-4 w-4 mr-1 text-amber-500" />
                      {t("提示词:", "Prompt:")}
                    </div>
                    <div className="text-muted-foreground">{selectedPrompt.name}</div>
                  </div>
                )}

                {enabledSearchTools.length > 0 && (
                  <div className="p-2 bg-blue-50 rounded-md">
                    <div className="font-medium flex items-center">
                      <Search className="h-4 w-4 mr-1 text-blue-500" />
                      {t("搜索工具:", "Search Tools:")}
                    </div>
                    <div className="text-muted-foreground">
                      {enabledSearchTools.map((tool) => tool.name).join(", ")}
                    </div>
                  </div>
                )}

                {activeKnowledgeFile && (
                  <div className="p-2 bg-green-50 rounded-md">
                    <div className="font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-1 text-green-500" />
                      {t("知识库:", "Knowledge Base:")}
                    </div>
                    <div className="text-muted-foreground">
                      {knowledgeBases.flatMap((kb) => kb.files).find((f) => f.id === activeKnowledgeFile)?.name}
                    </div>
                  </div>
                )}

                {!selectedPrompt && enabledSearchTools.length === 0 && !activeKnowledgeFile && (
                  <div className="text-muted-foreground text-center py-2">
                    {t("未启用任何工具", "No tools enabled")}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 上下文设置卡片 */}
          <Card className="rounded-xl shadow-md mt-4">
            <CardHeader className="pb-3 bg-gradient-to-r from-blue-100 to-purple-100">
              <CardTitle className="text-blue-800 flex items-center justify-between">
                <span className="flex items-center">
                  <History className="h-4 w-4 mr-2" />
                  {t("对话上下文", "Conversation Context")}
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="bg-blue-50">
                        {currentContextCount}/{contextLength}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {t(
                          "当前对话中的消息数量/最大上下文长度",
                          "Current number of messages in the conversation/maximum context length",
                        )}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t("上下文长度:", "Context length:")}</span>
                  <Select
                    value={contextLength.toString()}
                    onValueChange={(value) => setContextLength(Number.parseInt(value))}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder={t("选择长度", "Select length")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" className="w-full" onClick={clearChat}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t("清空对话历史", "Clear conversation history")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧聊天界面 */}
        <div className="md:col-span-3">
          <Card className="rounded-xl shadow-lg h-[600px] flex flex-col">
            <CardHeader className="pb-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Bot className="mr-2 h-5 w-5" />
                  {t("AI万能小助手", "AI Universal Assistant")}
                </CardTitle>

                <div className="flex items-center gap-2">
                  <Select value={selectedLLM} onValueChange={setSelectedLLM}>
                    <SelectTrigger className="w-[350px] bg-amber-600/90 text-white border-amber-400 focus:ring-amber-300 focus:border-amber-300">
                      <SelectValue placeholder={t("选择模型", "Select model")} />
                      <div className="ml-2 rounded-full bg-amber-500 px-1.5 py-0.5 text-xs font-medium">
                        {t("模型", "Model")}
                      </div>
                    </SelectTrigger>
                    <SelectContent className="min-w-[220px]">
                      {aiModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center">
                            <div className={`mr-2 h-2 w-2 rounded-full bg-${model.color}-500`}></div>
                            <div>
                              <div className="font-medium">{model.name}</div>
                              <div className="text-xs text-muted-foreground">{model.provider}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 rounded-full"
                    onClick={clearChat}
                  >
                    <RefreshCw size={18} />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* 错误提示 */}
            {apiError && (
              <Alert variant="destructive" className="mx-4 mt-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{t("错误", "Error")}</AlertTitle>
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}

            {/* 消息区域 */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user"
                      ? "justify-end"
                      : message.role === "tool"
                        ? "justify-center"
                        : "justify-start"
                  }`}
                >
                  {message.role === "tool" ? (
                    <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 max-w-[90%] border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center mb-2">
                        <Globe className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="font-medium text-blue-700 dark:text-blue-300">
                          {message.toolName === "tavily_search"
                            ? t("网络搜索结果", "Web Search Results")
                            : message.toolName}
                        </span>
                        {message.isStreaming && <Loader2 className="h-4 w-4 ml-2 animate-spin text-blue-500" />}
                      </div>
                      <div className="prose dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`flex items-start gap-2 max-w-[80%] ${
                        message.role === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <Avatar
                        className={`${
                          message.role === "user"
                            ? "bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-amber-300"
                            : "bg-gradient-to-br from-blue-400 to-purple-600 border-2 border-blue-300"
                        } shadow-md`}
                      >
                        {message.role === "user" ? (
                          <div className="flex items-center justify-center h-full w-full text-white font-bold">
                            <User size={16} className="mr-[1px]" />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full w-full text-white">
                            <Bot size={16} className={message.isStreaming ? "animate-pulse" : ""} />
                          </div>
                        )}
                      </Avatar>
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          message.role === "user" ? "bg-amber-500 text-white" : "bg-gray-100 dark:bg-gray-800"
                        }`}
                      >
                        {message.role === "assistant" ? (
                          <>
                            {message.model && (
                              <div className="text-xs text-muted-foreground mb-1">
                                {t("模型:", "Model:")}{" "}
                                {aiModels.find((m) => m.id === message.model)?.name || message.model}
                              </div>
                            )}
                            <div className="prose dark:prose-invert max-w-none">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {message.content || (message.isStreaming ? " " : "")}
                              </ReactMarkdown>
                              {message.isStreaming && (
                                <span className="inline-block w-2 h-4 bg-current animate-blink ml-0.5"></span>
                              )}
                            </div>
                          </>
                        ) : (
                          <p>{message.content}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* 输入区域 */}
            <div className="p-4 border-t">
              {searchError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <p className="text-sm">
                    {t("搜索错误:", "Search error:")} {searchError}
                  </p>
                </Alert>
              )}
              <div className="flex space-x-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t("输入您的问题...", "Enter your question...")}
                  className="flex-1 resize-none"
                  disabled={isLoading || searchLoading}
                  rows={1}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading || searchLoading}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  {isLoading || searchLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
