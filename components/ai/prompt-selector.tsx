"use client"

import { useState, useEffect } from "react"
import { Sparkles, Search, ChevronRight, ChevronDown, Folder } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/i18n/language-provider"

// 提示词类型定义
interface Prompt {
  id: string
  name: string
  content: string
  category_id: string
  category?: {
    id: string
    name: string
  }
  description: string
}

// 提示词类别类型定义
interface PromptCategory {
  id: string
  name: string
  prompts?: Prompt[]
}

interface PromptSelectorProps {
  onSelect?: (content: string) => void
  onSelectPrompt?: (prompt: Prompt | null) => void
  selectedPromptId?: string | null
}

export function PromptSelector({ onSelect, onSelectPrompt, selectedPromptId }: PromptSelectorProps) {
  const { language } = useLanguage()

  // 翻译函数
  const t = (zh: string, en: string) => (language === "en" ? en : zh)

  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [categories, setCategories] = useState<PromptCategory[]>([])
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 加载数据
  useEffect(() => {
    fetchData()
  }, [])

  // 获取所有数据
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // 获取分类
      const categoriesResponse = await fetch("/api/prompt-categories")
      if (!categoriesResponse.ok) {
        throw new Error(t("获取分类失败", "Failed to get categories"))
      }
      const categoriesData = await categoriesResponse.json()
      setCategories(categoriesData || [])

      // 默认所有分类都是收起状态
      // 不设置expandedCategories，保持为空数组

      // 获取提示词
      const promptsResponse = await fetch("/api/prompts")
      if (!promptsResponse.ok) {
        throw new Error(t("获取提示词失败", "Failed to get prompts"))
      }
      const promptsData = await promptsResponse.json()
      setPrompts(promptsData || [])

      // 添加调试日志
      console.log(t("获取到的提示词数据:", "Retrieved prompt data:"), promptsData)
      console.log(t("获取到的分类数据:", "Retrieved category data:"), categoriesData)
    } catch (error) {
      console.error(t("获取数据错误:", "Error getting data:"), error)
      setError(typeof error === "string" ? error : t("获取数据失败", "Failed to get data"))
    } finally {
      setLoading(false)
    }
  }

  // 切换分类展开状态
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      return prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    })
  }

  // 选择提示词
  const handleSelectPrompt = (prompt: Prompt | null) => {
    if (onSelectPrompt) {
      onSelectPrompt(prompt)
    }
    if (onSelect && prompt) {
      onSelect(prompt.content)
    }
  }

  // 过滤提示词
  const filteredPrompts = prompts.filter(
    (prompt) =>
      searchTerm === "" ||
      prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 按分类组织提示词
  const promptsByCategory = categories
    .map((category) => ({
      ...category,
      prompts: filteredPrompts.filter((prompt) => prompt.category_id === category.id),
    }))
    .filter((category) => category.prompts && category.prompts.length > 0)

  return (
    <Card className="rounded-xl shadow-md">
      <CardHeader className="pb-3 bg-gradient-to-r from-amber-100 to-yellow-100">
        <CardTitle className="text-amber-800">{t("提示词模板", "Prompt Templates")}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("搜索提示词...", "Search prompts...")}
            className="pl-8 rounded-lg border-amber-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="py-4 text-center text-muted-foreground">{t("加载中...", "Loading...")}</div>
        ) : error ? (
          <div className="py-4 text-center text-red-500">{error}</div>
        ) : promptsByCategory.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">
            {searchTerm
              ? t("未找到匹配的提示词", "No matching prompts found")
              : t("暂无提示词", "No prompts available")}
          </div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {promptsByCategory.map((category) => (
              <div key={category.id} className="space-y-1">
                <button
                  className="w-full flex items-center gap-2 p-2 hover:bg-amber-100 rounded-lg transition-colors text-left"
                  onClick={() => toggleCategory(category.id)}
                >
                  {expandedCategories.includes(category.id) ? (
                    <ChevronDown size={16} className="text-amber-500" />
                  ) : (
                    <ChevronRight size={16} className="text-amber-500" />
                  )}
                  <Folder size={16} className="text-amber-500" />
                  <span className="font-medium">{category.name}</span>
                  <Badge className="ml-auto bg-amber-100 text-amber-800 hover:bg-amber-200">
                    {category.prompts?.length || 0}
                  </Badge>
                </button>

                {expandedCategories.includes(category.id) && category.prompts && (
                  <div className="pl-6 space-y-2">
                    {category.prompts.map((prompt) => (
                      <div key={prompt.id} className="border rounded-md p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center">
                              <Sparkles size={16} className="text-amber-500 mr-2" />
                              <h3 className="font-medium">{prompt.name}</h3>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{prompt.description}</p>
                          </div>
                          <Switch
                            checked={selectedPromptId === prompt.id}
                            onCheckedChange={() => handleSelectPrompt(selectedPromptId === prompt.id ? null : prompt)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PromptSelector
