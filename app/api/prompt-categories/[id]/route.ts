import { type NextRequest, NextResponse } from "next/server"
import { getServiceSupabase, checkAdmin } from "@/lib/supabase"

// 获取单个提示词分类
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getServiceSupabase()
  const { data, error } = await supabase.from("prompt_categories").select("*").eq("id", params.id).single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// 更新提示词分类
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: "未授权" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const supabase = getServiceSupabase()

    const { data, error } = await supabase
      .from("prompt_categories")
      .update({ name: body.name })
      .eq("id", params.id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// 删除提示词分类
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: "未授权" }, { status: 401 })
  }

  try {
    const supabase = getServiceSupabase()

    // 首先检查是否有提示词使用此分类
    const { data: promptsUsingCategory, error: checkError } = await supabase
      .from("prompts")
      .select("id")
      .eq("category_id", params.id)

    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 500 })
    }

    if (promptsUsingCategory && promptsUsingCategory.length > 0) {
      return NextResponse.json(
        { error: `无法删除：有${promptsUsingCategory.length}个提示词正在使用此分类` },
        { status: 400 },
      )
    }

    // 如果没有提示词使用此分类，则可以安全删除
    const { error } = await supabase.from("prompt_categories").delete().eq("id", params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
