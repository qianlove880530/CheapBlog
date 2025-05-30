import { createClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()

    // 检查表是否存在
    const { error: tableCheckError } = await supabase.from("ai_tool_categories").select("id").limit(1).maybeSingle()

    // 如果表不存在，返回空数组而不是错误
    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      console.warn("ai_tool_categories table does not exist, returning empty array")
      return NextResponse.json([])
    }

    const { data, error } = await supabase.from("ai_tool_categories").select("*").order("name", { ascending: true })

    if (error) {
      console.error("Error fetching AI tool categories:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error in AI tool categories API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = createClient()

    const { data, error } = await supabase.from("ai_tool_categories").insert(body).select()

    if (error) {
      console.error("Error creating AI tool category:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0] || {})
  } catch (error) {
    console.error("Error in AI tool categories API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
