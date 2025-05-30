import { type NextRequest, NextResponse } from "next/server"
import { getServiceSupabase, checkAdmin } from "@/lib/supabase"

// 获取单个提示词
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from("prompts")
    .select("*, category:category_id(id, name)")
    .eq("id", params.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// 更新提示词
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: "未授权" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const supabase = getServiceSupabase()

    const { data, error } = await supabase
      .from("prompts")
      .update({
        name: body.name,
        content: body.content,
        description: body.description,
        category_id: body.category_id,
      })
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

// 删除提示词
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: "未授权" }, { status: 401 })
  }

  try {
    const supabase = getServiceSupabase()

    const { error } = await supabase.from("prompts").delete().eq("id", params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
