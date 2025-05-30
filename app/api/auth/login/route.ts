import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// 简单的管理员认证
const ADMIN_PASSWORD = "admin123"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "密码错误" }, { status: 401 })
    }

    // 设置一个简单的 cookie 标记管理员登录状态
    cookies().set("admin-auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7天过期
      path: "/",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "登录失败" }, { status: 500 })
  }
}
