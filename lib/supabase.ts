import { createClient as supabaseCreateClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// 重新导出 createClient 函数，解决部署错误
export const createClient = supabaseCreateClient

// 创建Supabase客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// 创建客户端单例
let supabaseInstance: ReturnType<typeof supabaseCreateClient> | null = null

// 客户端Supabase实例 (有限权限)
export const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = supabaseCreateClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseInstance
}

// 服务端Supabase实例 (管理员权限)
export const getServiceSupabase = () => {
  return supabaseCreateClient(supabaseUrl, supabaseServiceKey)
}

// 检查管理员权限 - 简化版本
export const checkAdmin = () => {
  const adminAuth = cookies().get("admin-auth")?.value
  return adminAuth === "true"
}

// 定义节点类型
export type Node = {
  id: string
  parent_id: string | null
  name: string
  name_en?: string
  type: "category1" | "category2" | "category3" | "content"
  content: string | null
  content_en?: string | null
  created_at: string
}
