"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/components/i18n/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Plus, ExternalLink, Star } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

// 定义AI工具类型
interface AITool {
  id: string
  name: string
  name_en: string
  description: string
  description_en: string
  url: string
  image_url: string
  category: string
  category_en: string
  tags: string[]
  featured: boolean
  clicks: number
  created_at: string
  updated_at: string
}

// 定义AI工具分类类型
interface AIToolCategory {
  id: string
  name: string
  name_en: string
  description: string
  description_en: string
}

export default function AIToolManager() {
  const { language } = useLanguage()
  const [tools, setTools] = useState<AITool[]>([])
  const [categories, setCategories] = useState<AIToolCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("tools")

  // 工具对话框状态
  const [isToolDialogOpen, setIsToolDialogOpen] = useState(false)
  const [currentTool, setCurrentTool] = useState<Partial<AITool> | null>(null)
  const [toolTags, setToolTags] = useState("")

  // 分类对话框状态
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Partial<AIToolCategory> | null>(null)

  // 删除确认对话框状态
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: "tool" | "category" } | null>(null)

  // 获取AI工具和分类数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // 获取分类
        const categoriesResponse = await fetch("/api/ai-tool-categories")
        const categoriesData = await categoriesResponse.json()

        // 获取工具
        const toolsResponse = await fetch("/api/ai-tools")
        const toolsData = await toolsResponse.json()

        setCategories(categoriesData)
        setTools(toolsData)
      } catch (error) {
        console.error("Error fetching AI tools data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 打开工具编辑对话框
  const openToolDialog = (tool?: AITool) => {
    if (tool) {
      setCurrentTool(tool)
      setToolTags(tool.tags.join(", "))
    } else {
      setCurrentTool({
        name: "",
        name_en: "",
        description: "",
        description_en: "",
        url: "",
        image_url: "",
        category: categories[0]?.name || "",
        category_en: categories[0]?.name_en || "",
        tags: [],
        featured: false,
        clicks: 0,
      })
      setToolTags("")
    }
    setIsToolDialogOpen(true)
  }

  // 打开分类编辑对话框
  const openCategoryDialog = (category?: AIToolCategory) => {
    if (category) {
      setCurrentCategory(category)
    } else {
      setCurrentCategory({
        name: "",
        name_en: "",
        description: "",
        description_en: "",
      })
    }
    setIsCategoryDialogOpen(true)
  }

  // 打开删除确认对话框
  const openDeleteDialog = (id: string, type: "tool" | "category") => {
    setItemToDelete({ id, type })
    setIsDeleteDialogOpen(true)
  }

  // 保存工具
  const saveTool = async () => {
    if (!currentTool) return

    try {
      const toolData = {
        ...currentTool,
        tags: toolTags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      }

      let response

      if (currentTool.id) {
        // 更新现有工具
        response = await fetch(`/api/ai-tools/${currentTool.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(toolData),
        })
      } else {
        // 创建新工具
        response = await fetch("/api/ai-tools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(toolData),
        })
      }

      if (!response.ok) {
        throw new Error("Failed to save tool")
      }

      const savedTool = await response.json()

      // 更新工具列表
      setTools((prev) => {
        if (currentTool.id) {
          return prev.map((t) => (t.id === savedTool.id ? savedTool : t))
        } else {
          return [...prev, savedTool]
        }
      })

      setIsToolDialogOpen(false)
    } catch (error) {
      console.error("Error saving tool:", error)
      alert("保存工具失败")
    }
  }

  // 保存分类
  const saveCategory = async () => {
    if (!currentCategory) return

    try {
      let response

      if (currentCategory.id) {
        // 更新现有分类
        response = await fetch(`/api/ai-tool-categories/${currentCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentCategory),
        })
      } else {
        // 创建新分类
        response = await fetch("/api/ai-tool-categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentCategory),
        })
      }

      if (!response.ok) {
        throw new Error("Failed to save category")
      }

      const savedCategory = await response.json()

      // 更新分类列表
      setCategories((prev) => {
        if (currentCategory.id) {
          return prev.map((c) => (c.id === savedCategory.id ? savedCategory : c))
        } else {
          return [...prev, savedCategory]
        }
      })

      setIsCategoryDialogOpen(false)
    } catch (error) {
      console.error("Error saving category:", error)
      alert("保存分类失败")
    }
  }

  // 删除项目
  const deleteItem = async () => {
    if (!itemToDelete) return

    try {
      const { id, type } = itemToDelete
      const endpoint = type === "tool" ? `/api/ai-tools/${id}` : `/api/ai-tool-categories/${id}`

      const response = await fetch(endpoint, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Failed to delete ${type}`)
      }

      // 更新列表
      if (type === "tool") {
        setTools((prev) => prev.filter((t) => t.id !== id))
      } else {
        setCategories((prev) => prev.filter((c) => c.id !== id))
      }

      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting item:", error)
      alert("删除失败")
    }
  }

  // 获取工具名称和描述
  const getToolName = (tool: AITool) => (language === "zh" ? tool.name : tool.name_en)
  const getToolDescription = (tool: AITool) => (language === "zh" ? tool.description : tool.description_en)
  const getCategoryName = (category: AIToolCategory) => (language === "zh" ? category.name : category.name_en)

  return (
    <div>
      <Tabs defaultValue="tools" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="tools">{language === "zh" ? "AI工具管理" : "AI Tools Management"}</TabsTrigger>
          <TabsTrigger value="categories">{language === "zh" ? "分类管理" : "Categories Management"}</TabsTrigger>
        </TabsList>

        {/* AI工具管理 */}
        <TabsContent value="tools">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{language === "zh" ? "AI工具列表" : "AI Tools List"}</h2>
            <Button onClick={() => openToolDialog()}>
              <Plus size={16} className="mr-2" />
              {language === "zh" ? "添加工具" : "Add Tool"}
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <div className="flex justify-between">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tools.map((tool) => (
                <Card key={tool.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-lg flex items-center">
                          {getToolName(tool)}
                          {tool.featured && <Star size={16} className="ml-2 text-amber-500" />}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{getToolDescription(tool)}</p>
                      </div>
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        {language === "zh" ? tool.category : tool.category_en}
                      </span>
                      {tool.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                      {tool.tags.length > 2 && (
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                          +{tool.tags.length - 2}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {language === "zh" ? "点击量: " : "Clicks: "}
                        {tool.clicks}
                      </span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openToolDialog(tool)}>
                          <Edit size={14} className="mr-1" />
                          {language === "zh" ? "编辑" : "Edit"}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(tool.id, "tool")}>
                          <Trash2 size={14} className="mr-1" />
                          {language === "zh" ? "删除" : "Delete"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* 分类管理 */}
        <TabsContent value="categories">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{language === "zh" ? "分类列表" : "Categories List"}</h2>
            <Button onClick={() => openCategoryDialog()}>
              <Plus size={16} className="mr-2" />
              {language === "zh" ? "添加分类" : "Add Category"}
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <div className="flex justify-between">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-lg mb-1">{getCategoryName(category)}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {language === "zh" ? category.description : category.description_en}
                    </p>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openCategoryDialog(category)}>
                        <Edit size={14} className="mr-1" />
                        {language === "zh" ? "编辑" : "Edit"}
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(category.id, "category")}>
                        <Trash2 size={14} className="mr-1" />
                        {language === "zh" ? "删除" : "Delete"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* 工具编辑对话框 */}
      <Dialog open={isToolDialogOpen} onOpenChange={setIsToolDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {currentTool?.id
                ? language === "zh"
                  ? "编辑AI工具"
                  : "Edit AI Tool"
                : language === "zh"
                  ? "添加AI工具"
                  : "Add AI Tool"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">{language === "zh" ? "名称 (中文)" : "Name (Chinese)"}</Label>
                <Input
                  id="name"
                  value={currentTool?.name || ""}
                  onChange={(e) => setCurrentTool((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                />
              </div>

              <div>
                <Label htmlFor="description">{language === "zh" ? "描述 (中文)" : "Description (Chinese)"}</Label>
                <Textarea
                  id="description"
                  value={currentTool?.description || ""}
                  onChange={(e) => setCurrentTool((prev) => (prev ? { ...prev, description: e.target.value } : null))}
                />
              </div>

              <div>
                <Label htmlFor="category">{language === "zh" ? "分类 (中文)" : "Category (Chinese)"}</Label>
                <Select
                  value={currentTool?.category || ""}
                  onValueChange={(value) => setCurrentTool((prev) => (prev ? { ...prev, category: value } : null))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === "zh" ? "选择分类" : "Select category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name_en">{language === "zh" ? "名称 (英文)" : "Name (English)"}</Label>
                <Input
                  id="name_en"
                  value={currentTool?.name_en || ""}
                  onChange={(e) => setCurrentTool((prev) => (prev ? { ...prev, name_en: e.target.value } : null))}
                />
              </div>

              <div>
                <Label htmlFor="description_en">{language === "zh" ? "描述 (英文)" : "Description (English)"}</Label>
                <Textarea
                  id="description_en"
                  value={currentTool?.description_en || ""}
                  onChange={(e) =>
                    setCurrentTool((prev) => (prev ? { ...prev, description_en: e.target.value } : null))
                  }
                />
              </div>

              <div>
                <Label htmlFor="category_en">{language === "zh" ? "分类 (英文)" : "Category (English)"}</Label>
                <Select
                  value={currentTool?.category_en || ""}
                  onValueChange={(value) => setCurrentTool((prev) => (prev ? { ...prev, category_en: value } : null))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === "zh" ? "选择分类" : "Select category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name_en}>
                        {category.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="url">{language === "zh" ? "URL" : "URL"}</Label>
              <Input
                id="url"
                value={currentTool?.url || ""}
                onChange={(e) => setCurrentTool((prev) => (prev ? { ...prev, url: e.target.value } : null))}
              />
            </div>

            <div>
              <Label htmlFor="image_url">{language === "zh" ? "图片URL" : "Image URL"}</Label>
              <Input
                id="image_url"
                value={currentTool?.image_url || ""}
                onChange={(e) => setCurrentTool((prev) => (prev ? { ...prev, image_url: e.target.value } : null))}
              />
            </div>

            <div>
              <Label htmlFor="tags">{language === "zh" ? "标签 (用逗号分隔)" : "Tags (comma separated)"}</Label>
              <Input id="tags" value={toolTags} onChange={(e) => setToolTags(e.target.value)} />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={currentTool?.featured || false}
                onCheckedChange={(checked) =>
                  setCurrentTool((prev) => (prev ? { ...prev, featured: checked === true } : null))
                }
              />
              <Label htmlFor="featured">{language === "zh" ? "推荐工具" : "Featured Tool"}</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsToolDialogOpen(false)}>
              {language === "zh" ? "取消" : "Cancel"}
            </Button>
            <Button onClick={saveTool}>{language === "zh" ? "保存" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 分类编辑对话框 */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentCategory?.id
                ? language === "zh"
                  ? "编辑分类"
                  : "Edit Category"
                : language === "zh"
                  ? "添加分类"
                  : "Add Category"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="category_name">{language === "zh" ? "名称 (中文)" : "Name (Chinese)"}</Label>
              <Input
                id="category_name"
                value={currentCategory?.name || ""}
                onChange={(e) => setCurrentCategory((prev) => (prev ? { ...prev, name: e.target.value } : null))}
              />
            </div>

            <div>
              <Label htmlFor="category_name_en">{language === "zh" ? "名称 (英文)" : "Name (English)"}</Label>
              <Input
                id="category_name_en"
                value={currentCategory?.name_en || ""}
                onChange={(e) => setCurrentCategory((prev) => (prev ? { ...prev, name_en: e.target.value } : null))}
              />
            </div>

            <div>
              <Label htmlFor="category_description">
                {language === "zh" ? "描述 (中文)" : "Description (Chinese)"}
              </Label>
              <Textarea
                id="category_description"
                value={currentCategory?.description || ""}
                onChange={(e) => setCurrentCategory((prev) => (prev ? { ...prev, description: e.target.value } : null))}
              />
            </div>

            <div>
              <Label htmlFor="category_description_en">
                {language === "zh" ? "描述 (英文)" : "Description (English)"}
              </Label>
              <Textarea
                id="category_description_en"
                value={currentCategory?.description_en || ""}
                onChange={(e) =>
                  setCurrentCategory((prev) => (prev ? { ...prev, description_en: e.target.value } : null))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
              {language === "zh" ? "取消" : "Cancel"}
            </Button>
            <Button onClick={saveCategory}>{language === "zh" ? "保存" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === "zh" ? "确认删除" : "Confirm Deletion"}</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p>
              {language === "zh"
                ? `确定要删除这个${itemToDelete?.type === "tool" ? "工具" : "分类"}吗？此操作无法撤销。`
                : `Are you sure you want to delete this ${itemToDelete?.type}? This action cannot be undone.`}
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              {language === "zh" ? "取消" : "Cancel"}
            </Button>
            <Button variant="destructive" onClick={deleteItem}>
              {language === "zh" ? "删除" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
