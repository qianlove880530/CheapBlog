import { type NextRequest, NextResponse } from "next/server"
import { getServiceSupabase, checkAdmin } from "@/lib/supabase"

// 获取单个节点
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getServiceSupabase()
  const searchParams = request.nextUrl.searchParams
  const lang = searchParams.get("lang") || "zh" // 默认为中文

  const { data, error } = await supabase.from("nodes").select("*").eq("id", params.id).single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 根据语言处理返回数据
  if (lang === "en") {
    data.name = data.name_en || data.name
    data.content = data.content_en || data.content
  }

  return NextResponse.json(data)
}

// 更新节点
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: "未授权" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const supabase = getServiceSupabase()

    // 确保更新时保留所有字段
    const updateData = { ...body }

    // 如果提供了name但没有提供name_en，则复制name到name_en
    if (body.name && !body.name_en) {
      updateData.name_en = body.name
    }

    // 如果提供了content但没有提供content_en，则复制content到content_en
    if (body.content && !body.content_en) {
      updateData.content_en = body.content
    }

    const { data, error } = await supabase.from("nodes").update(updateData).eq("id", params.id).select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// 删除节点
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: "未授权" }, { status: 401 })
  }

  try {
    const supabase = getServiceSupabase()

    const { error } = await supabase.from("nodes").delete().eq("id", params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
