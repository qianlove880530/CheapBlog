"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useAI } from "./ai-provider"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Loader2, Send, User, Bot } from "lucide-react"
import { useLanguage } from "@/components/i18n/language-provider"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface AIChatProps {
  title?: string
  placeholder?: string
  systemPrompt?: string
  initialMessages?: Message[]
  className?: string
}

export default function AIChat({
  title = "AI助手",
  placeholder = "输入您的问题...",
  systemPrompt = "你是一个有用的AI助手，提供简洁、准确的回答。",
  initialMessages = [],
  className = "",
}: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const { generateAIResponse, isProcessing, error } = useAI()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { language } = useLanguage()

  // 翻译函数
  const t = (zh: string, en: string) => (language === "en" ? en : zh)

  // 滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 处理发送消息
  const handleSend = async () => {
    if (!input.trim() || isProcessing) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // 构建提示词
    const prompt =
      messages
        .map((msg) => `${msg.role === "user" ? t("用户", "User") : t("助手", "Assistant")}: ${msg.content}`)
        .join("\n\n") + `\n\n${t("用户", "User")}: ${input}\n\n${t("助手", "Assistant")}:`

    try {
      // 添加一个空的助手消息，用于流式更新
      setMessages((prev) => [...prev, { role: "assistant", content: "" }])

      // 生成AI响应
      await generateAIResponse({
        prompt,
        systemPrompt,
        stream: true,
        onStream: (chunk) => {
          setMessages((prev) => {
            const newMessages = [...prev]
            const lastMessage = newMessages[newMessages.length - 1]
            if (lastMessage.role === "assistant") {
              lastMessage.content += chunk
            }
            return newMessages
          })
        },
      })
    } catch (err) {
      console.error(t("生成响应时出错:", "Error generating response:"), err)
    }
  }

  // 处理按键事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Card className={`flex flex-col h-[600px] ${className}`}>
      <CardHeader className="px-4 py-3 border-b">
        <CardTitle className="text-lg font-medium">{t(title, title === "AI助手" ? "AI Assistant" : title)}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            {t("开始与AI助手对话吧", "Start a conversation with the AI Assistant")}
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex items-start gap-2 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <Avatar className={message.role === "user" ? "bg-primary" : "bg-muted"}>
                  {message.role === "user" ? <User size={18} /> : <Bot size={18} />}
                </Avatar>
                <div
                  className={`rounded-lg px-3 py-2 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}
                >
                  {message.content ||
                    (message.role === "assistant" && isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "")}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="p-4 border-t">
        {error && <div className="text-sm text-red-500 mb-2">{error}</div>}
        <div className="flex w-full items-center space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t(placeholder, placeholder === "输入您的问题..." ? "Enter your question..." : placeholder)}
            className="flex-1 min-h-10 resize-none"
            disabled={isProcessing}
          />
          <Button onClick={handleSend} disabled={!input.trim() || isProcessing} className="rounded-full h-10 w-10 p-0">
            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
