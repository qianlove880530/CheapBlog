"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronRight, Folder, FileText } from "lucide-react"
import type { Node } from "@/lib/supabase"
import { useRouter, useSearchParams } from "next/navigation"
import { useLanguage } from "@/components/i18n/language-provider"

export default function TreeNavigation() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const contentId = searchParams.get("content")
  const [selectedContentId, setSelectedContentId] = useState<string | null>(contentId)
  const { language } = useLanguage()

  // 翻译函数
  const t = (zh: string, en: string) => (language === "zh" ? zh : en)

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const response = await fetch(`/api/nodes?lang=${language}`)
        if (!response.ok) {
          throw new Error(t("获取数据失败", "Failed to fetch data"))
        }
        const data = await response.json()
        setNodes(data)
      } catch (error) {
        setError(typeof error === "string" ? error : t("获取数据失败", "Failed to fetch data"))
        console.error(t("获取节点失败:", "Failed to fetch nodes:"), error)
      } finally {
        setLoading(false)
      }
    }

    fetchNodes()
  }, [language])

  useEffect(() => {
    setSelectedContentId(contentId)
  }, [contentId])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const toggleSubcategory = (subcategoryId: string) => {
    setExpandedSubcategories((prev) =>
      prev.includes(subcategoryId) ? prev.filter((id) => id !== subcategoryId) : [...prev, subcategoryId],
    )
  }

  const handleContentClick = (contentId: string) => {
    setSelectedContentId(contentId)
    router.push(`/blog?content=${contentId}`)
  }

  // 获取顶级分类（category1）
  const topLevelCategories = nodes.filter((node) => node.type === "category1")

  // 获取子分类（category2）
  const getSubcategories = (parentId: string) => {
    return nodes.filter((node) => node.parent_id === parentId && node.type === "category2")
  }

  // 获取三级分类（category3，即内容）
  const getThirdLevelCategories = (parentId: string) => {
    return nodes.filter((node) => node.parent_id === parentId && node.type === "category3")
  }

  if (loading) {
    return (
      <Card className="rounded-xl shadow-md">
        <CardHeader className="pb-3 bg-gradient-to-r from-pink-100 to-amber-100">
          <CardTitle className="text-pink-800">{t("知识库导航", "Knowledge Base Navigation")}</CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="py-4 text-center text-muted-foreground">{t("加载中...", "Loading...")}</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="rounded-xl shadow-md">
        <CardHeader className="pb-3 bg-gradient-to-r from-pink-100 to-amber-100">
          <CardTitle className="text-pink-800">{t("知识库导航", "Knowledge Base Navigation")}</CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="py-4 text-center text-red-500">
            {t("加载失败:", "Loading failed:")} {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-xl shadow-md">
      <CardHeader className="pb-3 bg-gradient-to-r from-pink-100 to-amber-100">
        <CardTitle className="text-pink-800">{t("知识库导航", "Knowledge Base Navigation")}</CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="space-y-1">
          {topLevelCategories.length === 0 ? (
            <div className="py-4 text-center text-muted-foreground">{t("暂无内容", "No content available")}</div>
          ) : (
            topLevelCategories.map((category) => (
              <div key={category.id} className="space-y-1">
                <button
                  className="w-full flex items-center gap-2 p-2 hover:bg-purple-600 hover:text-white rounded-lg transition-colors text-left"
                  onClick={() => toggleCategory(category.id)}
                >
                  {expandedCategories.includes(category.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <Folder size={16} className="text-pink-500" />
                  <span>{category.name}</span>
                </button>

                {expandedCategories.includes(category.id) && (
                  <div className="pl-6 space-y-1">
                    {getSubcategories(category.id).map((subcategory) => (
                      <div key={subcategory.id}>
                        <button
                          className="w-full flex items-center gap-2 p-2 hover:bg-purple-600 hover:text-white rounded-lg transition-colors text-left"
                          onClick={() => toggleSubcategory(subcategory.id)}
                        >
                          {expandedSubcategories.includes(subcategory.id) ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                          <Folder size={16} className="text-amber-500" />
                          <span>{subcategory.name}</span>
                        </button>

                        {expandedSubcategories.includes(subcategory.id) && (
                          <div className="pl-6 space-y-1">
                            {getThirdLevelCategories(subcategory.id).map((thirdLevel) => (
                              <button
                                key={thirdLevel.id}
                                className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-left ${
                                  selectedContentId === thirdLevel.id
                                    ? "bg-purple-700 text-white"
                                    : "hover:bg-purple-600 hover:text-white"
                                }`}
                                onClick={() => handleContentClick(thirdLevel.id)}
                              >
                                <FileText
                                  size={16}
                                  className={`${selectedContentId === thirdLevel.id ? "text-white" : "text-teal-500"}`}
                                />
                                <span>{thirdLevel.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
