import { type NextRequest, NextResponse } from "next/server"
import { getServiceSupabase, checkAdmin } from "@/lib/supabase"

// 获取所有提示词分类
export async function GET(request: NextRequest) {
  const supabase = getServiceSupabase()
  const searchParams = request.nextUrl.searchParams
  const lang = searchParams.get("lang") || "zh" // 默认为中文

  const { data, error } = await supabase.from("prompt_categories").select("*").order("created_at", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 根据语言处理返回数据
  const processedData = data.map((category) => {
    if (lang === "en") {
      return {
        ...category,
        name: category.name_en || category.name, // 如果英文名称不存在，则使用中文名称
      }
    }
    return category
  })

  return NextResponse.json(processedData)
}

// 创建提示词分类
export async function POST(request: NextRequest) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: "未授权" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const supabase = getServiceSupabase()

    // 确保同时保存中英文内容
    const categoryData = {
      name: body.name || "",
      name_en: body.name_en || body.name || "",
    }

    const { data, error } = await supabase.from("prompt_categories").insert(categoryData).select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
