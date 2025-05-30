import { createClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const supabase = createClient()

    const { data, error } = await supabase.from("ai_tools").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching AI tool with ID ${id}:`, error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in AI tool API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const supabase = createClient()

    const { data, error } = await supabase.from("ai_tools").update(body).eq("id", id).select()

    if (error) {
      console.error(`Error updating AI tool with ID ${id}:`, error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0] || {})
  } catch (error) {
    console.error("Error in AI tool API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const supabase = createClient()

    const { error } = await supabase.from("ai_tools").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting AI tool with ID ${id}:`, error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in AI tool API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
