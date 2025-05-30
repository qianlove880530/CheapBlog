"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Loader2, Bot, User, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ModelSelector, models } from "./model-selector"
import { PromptSelector } from "./prompt-selector"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Message {
  role: "user" | "assistant"
  content: string
  model?: string
}

export function OpenRouterChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "你好！我是AI助手。我可以帮你解答问题，请选择一个模型和提示词开始对话。",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState(models[0].id)
  const [systemPrompt, setSystemPrompt] = useState("")
  const [activeTab, setActiveTab] = useState<string>("models")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 处理发送消息
  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    // 添加用户消息
    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setError(null)
    setIsLoading(true)

    try {
      // 调用OpenRouter API
      const response = await fetch("/api/openrouter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
          systemPrompt: systemPrompt || undefined,
          model: selectedModel,
          temperature: 0.7,
          maxTokens: 2000,
        }),
      })

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`)
      }

      const data = await response.json()

      // 添加助手回复
      const assistantMessage: Message = {
        role: "assistant",
        content: data.text,
        model: data.model || selectedModel,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      console.error("发送消息时出错:", err)
      setError(err instanceof Error ? err.message : "发送消息时出错")
    } finally {
      setIsLoading(false)
    }
  }

  // 处理按键事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // 处理系统提示更改
  const handleSystemPromptChange = (prompt: string) => {
    setSystemPrompt(prompt)
  }

  // 清空对话
  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "你好！我是AI助手。我可以帮你解答问题，请选择一个模型和提示词开始对话。",
      },
    ])
  }

  // 获取模型名称
  const getModelName = (modelId: string) => {
    const model = models.find((m) => m.id === modelId)
    return model ? model.name : modelId
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span>OpenRouter AI 聊天</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleClearChat}>
            <RefreshCw className="h-4 w-4 mr-2" />
            清空对话
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="models">选择模型</TabsTrigger>
              <TabsTrigger value="prompts">提示词模板</TabsTrigger>
            </TabsList>
            <TabsContent value="models" className="p-4">
              <ModelSelector value={selectedModel} onChange={setSelectedModel} />
              <p className="text-xs text-muted-foreground mt-2">
                当前选择: <span className="font-medium">{getModelName(selectedModel)}</span>
              </p>
            </TabsContent>
            <TabsContent value="prompts" className="p-4">
              <PromptSelector onSelect={handleSystemPromptChange} />
            </TabsContent>
          </Tabs>
        </div>

        <ScrollArea className="h-[400px] p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <Bot className="h-12 w-12 mb-4 text-muted-foreground/50" />
              <p>开始一个新的对话</p>
              <p className="text-sm">选择一个模型和提示词，然后发送消息开始聊天</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                    <Avatar className={`h-8 w-8 ${message.role === "user" ? "bg-blue-600" : "bg-purple-600"}`}>
                      {message.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                    </Avatar>
                    <div
                      className={`rounded-lg p-3 ${message.role === "user" ? "bg-blue-600 text-white" : "bg-muted"}`}
                    >
                      {message.model && message.role === "assistant" && (
                        <div className="text-xs text-muted-foreground mb-1">模型: {getModelName(message.model)}</div>
                      )}
                      <div className="prose dark:prose-invert prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
          {isLoading && (
            <div className="flex justify-start mt-4">
              <div className="flex gap-3 max-w-[80%]">
                <Avatar className="h-8 w-8 bg-purple-600">
                  <Bot className="h-5 w-5" />
                </Avatar>
                <div className="rounded-lg p-3 bg-muted flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>AI正在思考...</span>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-center mt-4">
              <div className="rounded-lg p-3 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-sm">
                错误: {error}
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <div className="flex w-full items-center space-x-2">
          <Textarea
            placeholder="输入消息..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 resize-none"
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={!input.trim() || isLoading} className="shrink-0">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
