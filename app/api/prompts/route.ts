import { type NextRequest, NextResponse } from "next/server"
import { getServiceSupabase, checkAdmin } from "@/lib/supabase"

// 获取所有提示词
export async function GET(request: NextRequest) {
  const supabase = getServiceSupabase()
  const searchParams = request.nextUrl.searchParams
  const lang = searchParams.get("lang") || "zh" // 默认为中文

  const { data, error } = await supabase
    .from("prompts")
    .select("*, category:category_id(id, name, name_en)")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 根据语言处理返回数据
  const processedData = data.map((prompt) => {
    if (lang === "en") {
      return {
        ...prompt,
        name: prompt.name_en || prompt.name,
        description: prompt.description_en || prompt.description,
        content: prompt.content_en || prompt.content,
        category: prompt.category
          ? {
              ...prompt.category,
              name: prompt.category.name_en || prompt.category.name,
            }
          : null,
      }
    }
    return prompt
  })

  return NextResponse.json(processedData)
}

// 创建提示词
export async function POST(request: NextRequest) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: "未授权" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const supabase = getServiceSupabase()

    // 确保同时保存中英文内容
    const promptData = {
      name: body.name || "",
      name_en: body.name_en || body.name || "",
      content: body.content || "",
      content_en: body.content_en || body.content || "",
      description: body.description || "",
      description_en: body.description_en || body.description || "",
      category_id: body.category_id,
    }

    const { data, error } = await supabase.from("prompts").insert(promptData).select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
