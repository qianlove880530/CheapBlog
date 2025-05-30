import { type NextRequest, NextResponse } from "next/server"

// OpenRouter API配置
const OPENROUTER_API_KEY = "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"
const OPENROUTER_API_BASE = "https://openrouter.ai/api/v1"

// 定义请求体的类型
interface AIRequestBody {
  prompt?: string
  messages?: Array<{ role: string; content: string; name?: string }>
  systemPrompt?: string
  stream?: boolean
  temperature?: number
  maxTokens?: number
  model?: string
}

// 处理POST请求
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = (await request.json()) as AIRequestBody
    const {
      prompt,
      messages,
      systemPrompt,
      stream = false,
      temperature = 0.7,
      maxTokens = 1000,
      model = "google/gemini-2.0-flash-exp:free", // 默认模型
    } = body

    // 验证必要的参数
    if (!prompt && (!messages || messages.length === 0)) {
      console.error("缺少必要的参数: prompt或messages")
      return NextResponse.json({ error: "缺少必要的参数: prompt或messages" }, { status: 400 })
    }

    try {
      // 构建消息数组
      let apiMessages = []

      // 如果提供了系统提示，添加为系统消息
      if (systemPrompt) {
        apiMessages.push({ role: "system", content: systemPrompt })
      }

      // 如果提供了消息历史，使用它
      if (messages && messages.length > 0) {
        // 处理消息，确保格式正确
        const validMessages = messages.filter(
          (msg) => msg && typeof msg === "object" && typeof msg.content === "string",
        )

        // 确保系统消息只有一个，如果有多个系统消息，只保留第一个
        let hasSystemMessage = apiMessages.some((msg) => msg.role === "system")

        apiMessages = [
          ...apiMessages,
          ...validMessages.map((msg) => {
            // 确保角色是有效的
            let validRole = ["user", "assistant", "system", "tool"].includes(msg.role) ? msg.role : "user"

            // 如果已经有系统消息，并且当前消息也是系统消息，则将其转换为用户消息
            if (validRole === "system" && hasSystemMessage) {
              validRole = "user"
            }

            // 如果这是第一个系统消息，标记已存在系统消息
            if (validRole === "system") {
              hasSystemMessage = true
            }

            // 处理工具消息
            if (validRole === "tool") {
              return {
                role: "tool",
                content: msg.content || " ", // 确保内容不为空
                name: msg.name || "unknown_tool",
              }
            }
            // 处理其他消息
            return {
              role: validRole,
              content: msg.content || " ", // 确保内容不为空
            }
          }),
        ]
      } else if (prompt) {
        // 否则使用单个提示
        apiMessages.push({ role: "user", content: prompt })
      }

      // 确保消息数组不为空
      if (apiMessages.length === 0) {
        apiMessages.push({ role: "user", content: "Hello" })
      }

      // 确保每条消息都有内容
      apiMessages = apiMessages.map((msg) => ({
        ...msg,
        content: msg.content || " ", // 使用空格而不是空字符串，避免API错误
      }))

      // 确保消息格式正确 - OpenRouter要求至少有一条用户消息
      const hasUserMessage = apiMessages.some((msg) => msg.role === "user")
      if (!hasUserMessage) {
        apiMessages.push({ role: "user", content: "请回答我的问题" })
      }

      console.log("使用模型:", model)
      console.log("发送消息数量:", apiMessages.length)
      console.log("消息角色:", apiMessages.map((msg) => msg.role).join(", "))

      // 构建请求体
      const requestBody = {
        model: model,
        messages: apiMessages,
        temperature: temperature,
        max_tokens: maxTokens,
        stream: stream,
      }

      if (stream) {
        // 流式响应
        try {
          const response = await fetch(`${OPENROUTER_API_BASE}/chat/completions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${OPENROUTER_API_KEY}`,
              "HTTP-Referer": "https://your-site.com", // 替换为您的网站
              "X-Title": "Modern Blog AI Assistant",
            },
            body: JSON.stringify(requestBody),
          })

          // 检查响应状态
          if (!response.ok) {
            const errorText = await response.text()
            let errorData = {}
            try {
              errorData = JSON.parse(errorText)
            } catch (e) {
              errorData = { error: errorText }
            }

            console.error(`OpenRouter API错误 (${response.status}):`, errorData)

            // 返回一个流式错误响应
            return new Response(
              `data: {"choices":[{"delta":{"content":"抱歉，API请求失败 (${response.status})。请稍后再试。"}}]}\n\ndata: [DONE]\n\n`,
              {
                headers: {
                  "Content-Type": "text/event-stream",
                  "Cache-Control": "no-cache, no-transform",
                  Connection: "keep-alive",
                },
              },
            )
          }

          // 检查响应体是否存在
          if (!response.body) {
            console.error("OpenRouter API返回了空的响应体")
            return new Response(
              `data: {"choices":[{"delta":{"content":"抱歉，API返回了空的响应体。请稍后再试。"}}]}\n\ndata: [DONE]\n\n`,
              {
                headers: {
                  "Content-Type": "text/event-stream",
                  "Cache-Control": "no-cache, no-transform",
                  Connection: "keep-alive",
                },
              },
            )
          }

          // 返回流式响应，确保正确传递所有事件
          return new Response(response.body, {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache, no-transform",
              Connection: "keep-alive",
            },
          })
        } catch (streamError) {
          console.error("流式响应处理错误:", streamError)
          // 如果流式响应失败，返回一个简单的文本响应
          return new Response(
            `data: {"choices":[{"delta":{"content":"抱歉，处理您的请求时出现了问题。请重试。"}}]}\n\ndata: [DONE]\n\n`,
            {
              headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache, no-transform",
                Connection: "keep-alive",
              },
            },
          )
        }
      } else {
        // 非流式响应
        try {
          const response = await fetch(`${OPENROUTER_API_BASE}/chat/completions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${OPENROUTER_API_KEY}`,
              "HTTP-Referer": "https://your-site.com", // 替换为您的网站
              "X-Title": "Modern Blog AI Assistant",
            },
            body: JSON.stringify(requestBody),
          })

          if (!response.ok) {
            const errorText = await response.text()
            console.error(`OpenRouter API错误 (${response.status}):`, errorText)
            return NextResponse.json({
              text: `AI助手暂时无法使用 (错误代码: ${response.status})。请稍后再试。`,
              error: "API请求失败",
            })
          }

          const data = await response.json()

          // 添加调试信息
          console.log("OpenRouter响应成功")

          // 检查响应格式并提取内容
          if (data.choices && data.choices[0] && data.choices[0].message) {
            return NextResponse.json({
              text: data.choices[0].message.content,
              model: data.model || model, // 返回使用的模型信息
            })
          } else {
            console.error("OpenRouter响应格式异常:", data)
            return NextResponse.json({
              text: "AI助手返回了异常格式的响应。请稍后再试。",
              error: "响应格式异常",
            })
          }
        } catch (apiError) {
          console.error("OpenRouter API请求错误:", apiError)
          return NextResponse.json({
            text: "AI助手暂时无法使用。请稍后再试。",
            error: apiError instanceof Error ? apiError.message : "未知API错误",
          })
        }
      }
    } catch (apiError) {
      console.error("OpenRouter API错误:", apiError)

      // 返回一个友好的错误消息
      return NextResponse.json({
        text: "AI助手暂时无法使用。请稍后再试。",
        error: apiError instanceof Error ? apiError.message : "未知API错误",
      })
    }
  } catch (error) {
    console.error("AI处理错误:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI处理过程中发生错误" },
      { status: 500 },
    )
  }
}
