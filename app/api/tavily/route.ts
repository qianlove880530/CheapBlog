import { type NextRequest, NextResponse } from "next/server"

// Tavily API配置
const TAVILY_API_KEY = process.env.TAVILY_API_KEY || "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"
const TAVILY_API_BASE = "https://api.tavily.com/search"

// 定义请求体的类型
interface SearchRequestBody {
  query: string
  search_depth?: "basic" | "advanced"
  include_domains?: string[]
  exclude_domains?: string[]
  max_results?: number
}

// 处理POST请求
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = (await request.json()) as SearchRequestBody
    const { query, search_depth = "advanced", max_results = 5 } = body

    // 验证必要的参数
    if (!query) {
      return NextResponse.json({ error: "缺少必要的参数: query" }, { status: 400 })
    }

    console.log("执行Tavily搜索:", query)

    try {
      // 调用Tavily API - 修正了认证头部
      const response = await fetch(TAVILY_API_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 修正: 使用正确的认证头部格式
          Authorization: `Bearer ${TAVILY_API_KEY}`,
        },
        body: JSON.stringify({
          query,
          search_depth,
          include_answer: true,
          include_images: false,
          include_raw_content: false,
          max_results,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Tavily API错误:", errorData)
        return NextResponse.json({ error: errorData.error || "搜索API请求失败" }, { status: response.status })
      }

      const data = await response.json()
      console.log("Tavily搜索结果:", data)

      return NextResponse.json(data)
    } catch (apiError) {
      console.error("Tavily API错误:", apiError)
      return NextResponse.json({
        error: apiError instanceof Error ? apiError.message : "搜索API错误",
      })
    }
  } catch (error) {
    console.error("搜索处理错误:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "搜索处理过程中发生错误" },
      { status: 500 },
    )
  }
}
