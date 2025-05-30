"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

// 定义AI请求的类型
interface AIRequest {
  prompt: string
  systemPrompt?: string
  stream?: boolean
  temperature?: number
  maxTokens?: number
  onStream?: (chunk: string) => void
  onFinish?: (fullText: string) => void
}

// 定义AI上下文的类型
interface AIContextType {
  generateAIResponse: (request: AIRequest) => Promise<string>
  isProcessing: boolean
  error: string | null
}

// 创建AI上下文
const AIContext = createContext<AIContextType | undefined>(undefined)

// AI提供者组件
export function AIProvider({ children }: { children: ReactNode }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 生成AI响应的函数
  const generateAIResponse = useCallback(async (request: AIRequest): Promise<string> => {
    const { prompt, systemPrompt, stream = false, temperature = 0.7, maxTokens = 1000, onStream, onFinish } = request

    setIsProcessing(true)
    setError(null)

    try {
      // 添加重试逻辑
      let retries = 0
      const maxRetries = 2

      while (retries <= maxRetries) {
        try {
          if (stream) {
            // 处理流式响应
            const response = await fetch("/api/ai", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                prompt,
                systemPrompt,
                stream: true,
                temperature,
                maxTokens,
              }),
            })

            if (!response.ok) {
              const error = await response.json()
              throw new Error(error.error || "生成AI响应时出错")
            }

            const reader = response.body?.getReader()
            if (!reader) {
              throw new Error("无法读取响应流")
            }

            let fullText = ""
            const decoder = new TextDecoder()

            while (true) {
              const { done, value } = await reader.read()
              if (done) break

              const chunk = decoder.decode(value)
              fullText += chunk
              onStream?.(chunk)
            }

            onFinish?.(fullText)
            return fullText
          } else {
            // 处理非流式响应
            const response = await fetch("/api/ai", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                prompt,
                systemPrompt,
                stream: false,
                temperature,
                maxTokens,
              }),
            })

            if (!response.ok) {
              const error = await response.json()
              throw new Error(error.error || "生成AI响应时出错")
            }

            const data = await response.json()
            onFinish?.(data.text)
            return data.text
          }
        } catch (err) {
          retries++
          if (retries > maxRetries) throw err
          // 等待一段时间后重试
          await new Promise((resolve) => setTimeout(resolve, 1000 * retries))
        }
      }

      // 这行代码不应该被执行，但TypeScript需要一个返回值
      return "无法生成响应"
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "生成AI响应时出错"
      console.error("AI响应错误:", errorMessage)
      setError(errorMessage)

      // 返回一个友好的错误消息作为降级策略
      const fallbackResponse = "很抱歉，AI助手暂时无法提供服务。请稍后再试。"
      onFinish?.(fallbackResponse)
      return fallbackResponse
    } finally {
      setIsProcessing(false)
    }
  }, [])

  return <AIContext.Provider value={{ generateAIResponse, isProcessing, error }}>{children}</AIContext.Provider>
}

// 使用AI上下文的钩子
export function useAI() {
  const context = useContext(AIContext)
  if (context === undefined) {
    throw new Error("useAI必须在AIProvider内部使用")
  }
  return context
}
