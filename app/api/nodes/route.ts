import { type NextRequest, NextResponse } from "next/server"
import { getServiceSupabase, checkAdmin } from "@/lib/supabase"

// 获取所有节点
export async function GET(request: NextRequest) {
  const supabase = getServiceSupabase()
  const searchParams = request.nextUrl.searchParams
  const lang = searchParams.get("lang") || "zh" // 默认为中文

  const { data, error } = await supabase.from("nodes").select("*").order("created_at", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 根据语言处理返回数据
  const processedData = data.map((node) => {
    if (lang === "en") {
      return {
        ...node,
        name: node.name_en || node.name, // 如果英文名称不存在，则使用中文名称
        content: node.content_en || node.content, // 如果英文内容不存在，则使用中文内容
      }
    }
    return node
  })

  return NextResponse.json(processedData)
}

// 创建节点
export async function POST(request: NextRequest) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: "未授权" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const supabase = getServiceSupabase()

    // 确保同时保存中英文内容
    const nodeData = {
      ...body,
      name: body.name || "",
      name_en: body.name_en || body.name || "",
      content: body.content || null,
      content_en: body.content_en || body.content || null,
    }

    const { data, error } = await supabase.from("nodes").insert(nodeData).select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
