import { createClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const supabase = createClient()

    // 首先获取当前点击数
    const { data: tool, error: fetchError } = await supabase.from("ai_tools").select("clicks").eq("id", id).single()

    if (fetchError) {
      console.error("Error fetching tool clicks:", fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    // 更新点击数
    const currentClicks = tool?.clicks || 0
    const { data, error: updateError } = await supabase
      .from("ai_tools")
      .update({ clicks: currentClicks + 1 })
      .eq("id", id)
      .select()

    if (updateError) {
      console.error("Error updating tool clicks:", updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, clicks: currentClicks + 1 })
  } catch (error) {
    console.error("Error in tool click API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
