import { type NextRequest, NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText, streamText } from "ai"

// 定义请求体的类型
interface AIRequestBody {
  prompt: string
  systemPrompt?: string
  stream?: boolean
  temperature?: number
  maxTokens?: number
}

// 处理POST请求
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = (await request.json()) as AIRequestBody
    const { prompt, systemPrompt, stream = false, temperature = 0.7, maxTokens = 1000 } = body

    // 验证必要的参数
    if (!prompt) {
      return NextResponse.json({ error: "缺少必要的参数: prompt" }, { status: 400 })
    }

    // 检查Groq API密钥是否存在
    if (!process.env.GROQ_API_KEY) {
      console.warn("缺少GROQ_API_KEY环境变量，返回模拟响应")
      // 返回一个模拟响应作为降级策略
      return NextResponse.json({
        text: "AI助手暂时无法使用。请确保已配置正确的API密钥。",
      })
    }

    try {
      // 使用Groq的deepseek-r1-distill-llama-70b模型
      const model = groq("deepseek-r1-distill-llama-70b")

      // 根据是否需要流式响应选择不同的处理方式
      if (stream) {
        // 流式响应
        const response = await streamText({
          model,
          prompt,
          system: systemPrompt,
          temperature,
          maxTokens,
        })

        return new NextResponse(response.toReadableStream())
      } else {
        // 非流式响应
        const response = await generateText({
          model,
          prompt,
          system: systemPrompt,
          temperature,
          maxTokens,
        })

        return NextResponse.json({ text: response.text })
      }
    } catch (groqError) {
      console.error("Groq API错误:", groqError)

      // 返回一个友好的错误消息
      return NextResponse.json({
        text: "AI助手暂时无法使用。请稍后再试。",
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
