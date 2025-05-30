"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Plus, Search, Loader2, Sparkles, FolderPlus, Folder } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  created_at: string
  updated_at: string
}

// 提示词类别类型定义
interface PromptCategory {
  id: string
  name: string
}

export default function PromptManager() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [categories, setCategories] = useState<PromptCategory[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"prompts" | "categories">("prompts")

  // 对话框状态
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false)
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null)
  const [currentCategory, setCurrentCategory] = useState<PromptCategory | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    category_id: "",
    description: "",
  })
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
  })
  const [formLoading, setFormLoading] = useState(false)

  const { toast } = useToast()

  // 加载数据
  useEffect(() => {
    fetchPrompts()
    fetchCategories()
  }, [])

  // 获取所有提示词
  const fetchPrompts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/prompts")
      if (!response.ok) {
        throw new Error("获取提示词失败")
      }
      const data = await response.json()
      setPrompts(data)
    } catch (error) {
      console.error("获取提示词错误:", error)
      toast({
        variant: "destructive",
        title: "错误",
        description: "获取提示词失败",
      })
    } finally {
      setLoading(false)
    }
  }

  // 获取所有分类
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/prompt-categories")
      if (!response.ok) {
        throw new Error("获取分类失败")
      }
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("获取分类错误:", error)
      toast({
        variant: "destructive",
        title: "错误",
        description: "获取分类失败",
      })
    }
  }

  // 过滤提示词
  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      searchTerm === "" ||
      prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === null || prompt.category_id === selectedCategory

    return matchesSearch && matchesCategory
  })

  // 获取类别名称
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.name : "未分类"
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  // 添加提示词
  const handleAddPrompt = () => {
    setFormData({
      name: "",
      content: "",
      category_id: categories.length > 0 ? categories[0].id : "",
      description: "",
    })
    setIsAddDialogOpen(true)
  }

  // 编辑提示词
  const handleEditPrompt = (prompt: Prompt) => {
    setCurrentPrompt(prompt)
    setFormData({
      name: prompt.name,
      content: prompt.content,
      category_id: prompt.category_id,
      description: prompt.description,
    })
    setIsEditDialogOpen(true)
  }

  // 删除提示词
  const handleDeletePrompt = (prompt: Prompt) => {
    setCurrentPrompt(prompt)
    setIsDeleteDialogOpen(true)
  }

  // 添加分类
  const handleAddCategory = () => {
    setCategoryFormData({
      name: "",
    })
    setIsAddCategoryDialogOpen(true)
  }

  // 删除分类
  const handleDeleteCategory = (category: PromptCategory) => {
    setCurrentCategory(category)
    setIsDeleteCategoryDialogOpen(true)
  }

  // 提交添加提示词
  const submitAddPrompt = async () => {
    if (!formData.name || !formData.content || !formData.category_id) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请填写所有必填字段",
      })
      return
    }

    setFormLoading(true)

    try {
      const response = await fetch("/api/prompts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "添加提示词失败")
      }

      await fetchPrompts()
      setIsAddDialogOpen(false)
      toast({
        title: "成功",
        description: "提示词添加成功",
      })
    } catch (error: any) {
      console.error("添加提示词错误:", error)
      toast({
        variant: "destructive",
        title: "错误",
        description: error.message || "添加提示词失败",
      })
    } finally {
      setFormLoading(false)
    }
  }

  // 提交编辑提示词
  const submitEditPrompt = async () => {
    if (!currentPrompt || !formData.name || !formData.content || !formData.category_id) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请填写所有必填字段",
      })
      return
    }

    setFormLoading(true)

    try {
      const response = await fetch(`/api/prompts/${currentPrompt.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "更新提示词失败")
      }

      await fetchPrompts()
      setIsEditDialogOpen(false)
      toast({
        title: "成功",
        description: "提示词更新成功",
      })
    } catch (error: any) {
      console.error("更新提示词错误:", error)
      toast({
        variant: "destructive",
        title: "错误",
        description: error.message || "更新提示词失败",
      })
    } finally {
      setFormLoading(false)
    }
  }

  // 提交删除提示词
  const submitDeletePrompt = async () => {
    if (!currentPrompt) return

    setFormLoading(true)

    try {
      const response = await fetch(`/api/prompts/${currentPrompt.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "删除提示词失败")
      }

      await fetchPrompts()
      setIsDeleteDialogOpen(false)
      toast({
        title: "成功",
        description: "提示词删除成功",
      })
    } catch (error: any) {
      console.error("删除提示词错误:", error)
      toast({
        variant: "destructive",
        title: "错误",
        description: error.message || "删除提示词失败",
      })
    } finally {
      setFormLoading(false)
    }
  }

  // 提交添加分类
  const submitAddCategory = async () => {
    if (!categoryFormData.name.trim()) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "分类名称不能为空",
      })
      return
    }

    setFormLoading(true)

    try {
      const response = await fetch("/api/prompt-categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryFormData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "添加分类失败")
      }

      await fetchCategories()
      setIsAddCategoryDialogOpen(false)
      toast({
        title: "成功",
        description: "分类添加成功",
      })
    } catch (error: any) {
      console.error("添加分类错误:", error)
      toast({
        variant: "destructive",
        title: "错误",
        description: error.message || "添加分类失败",
      })
    } finally {
      setFormLoading(false)
    }
  }

  // 提交删除分类
  const submitDeleteCategory = async () => {
    if (!currentCategory) return

    setFormLoading(true)

    try {
      const response = await fetch(`/api/prompt-categories/${currentCategory.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "删除分类失败")
      }

      await fetchCategories()
      await fetchPrompts() // 刷新提示词列表，以防有关联更新
      setIsDeleteCategoryDialogOpen(false)
      toast({
        title: "成功",
        description: "分类删除成功",
      })
    } catch (error: any) {
      console.error("删除分类错误:", error)
      toast({
        variant: "destructive",
        title: "错误",
        description: error.message || "删除分类失败",
      })
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">提示词管理</h2>
          <p className="text-sm text-muted-foreground">管理和优化AI提示词模板，提升AI回答质量</p>
        </div>
        <div className="flex gap-2">
          {activeTab === "prompts" && (
            <Button
              onClick={handleAddPrompt}
              className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              添加提示词
            </Button>
          )}
          {activeTab === "categories" && (
            <Button
              onClick={handleAddCategory}
              className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <FolderPlus className="mr-2 h-4 w-4" />
              添加分类
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "prompts" | "categories")}>
        <TabsList className="mb-4">
          <TabsTrigger value="prompts">提示词列表</TabsTrigger>
          <TabsTrigger value="categories">分类管理</TabsTrigger>
        </TabsList>

        <TabsContent value="prompts">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索提示词..."
                className="pl-8 rounded-lg border-pink-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={selectedCategory || "all"}
              onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有分类</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card className="rounded-xl shadow-lg">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <TableRow>
                    <TableHead className="w-[30%]">提示词名称</TableHead>
                    <TableHead className="w-[20%]">分类</TableHead>
                    <TableHead className="w-[30%]">描述</TableHead>
                    <TableHead>更新时间</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex justify-center items-center">
                          <Loader2 className="h-8 w-8 animate-spin text-purple-500 mr-2" />
                          <span>加载中...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredPrompts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        暂无提示词
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPrompts.map((prompt) => (
                      <TableRow key={prompt.id} className="hover:bg-purple-50/50">
                        <TableCell className="flex items-center space-x-2">
                          <Sparkles className="h-5 w-5 text-purple-500" />
                          <span className="font-medium">{prompt.name}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                            {prompt.category ? prompt.category.name : getCategoryName(prompt.category_id)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{prompt.description}</TableCell>
                        <TableCell>{formatDate(prompt.updated_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-purple-600 hover:bg-purple-50"
                              onClick={() => handleEditPrompt(prompt)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-pink-50"
                              onClick={() => handleDeletePrompt(prompt)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card className="rounded-xl shadow-lg">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <TableRow>
                    <TableHead className="w-[40%]">分类名称</TableHead>
                    <TableHead className="w-[40%]">提示词数量</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8">
                        <div className="flex justify-center items-center">
                          <Loader2 className="h-8 w-8 animate-spin text-purple-500 mr-2" />
                          <span>加载中...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : categories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                        暂无分类
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((category) => {
                      const promptCount = prompts.filter((p) => p.category_id === category.id).length
                      return (
                        <TableRow key={category.id} className="hover:bg-purple-50/50">
                          <TableCell className="flex items-center space-x-2">
                            <Folder className="h-5 w-5 text-purple-500" />
                            <span className="font-medium">{category.name}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                              {promptCount} 个提示词
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-pink-50"
                              onClick={() => handleDeleteCategory(category)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 添加提示词对话框 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>添加提示词</DialogTitle>
            <DialogDescription>创建新的AI提示词模板。定义专业角色和指令可以显著提高AI回答的质量。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                名称
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                分类
              </Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                描述
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="col-span-3"
                placeholder="简短描述该提示词的用途..."
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="content" className="text-right pt-2">
                提示词内容
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="col-span-3 min-h-[200px]"
                placeholder="编写详细的提示词内容..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              取消
            </Button>
            <Button
              onClick={submitAddPrompt}
              disabled={formLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {formLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>编辑提示词</DialogTitle>
            <DialogDescription>修改AI提示词模板内容和信息。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                名称
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">
                分类
              </Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                描述
              </Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-content" className="text-right pt-2">
                提示词内容
              </Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="col-span-3 min-h-[200px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
            <Button
              onClick={submitEditPrompt}
              disabled={formLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {formLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>您确定要删除"{currentPrompt?.name}"提示词吗？此操作无法撤销。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={submitDeletePrompt} disabled={formLoading}>
              {formLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>添加分类</DialogTitle>
            <DialogDescription>创建新的提示词分类。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category-name" className="text-right">
                分类名称
              </Label>
              <Input
                id="category-name"
                value={categoryFormData.name}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                className="col-span-3"
                placeholder="输入分类名称..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCategoryDialogOpen(false)}>
              取消
            </Button>
            <Button
              onClick={submitAddCategory}
              disabled={formLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {formLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteCategoryDialogOpen} onOpenChange={setIsDeleteCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              您确定要删除"{currentCategory?.name}"分类吗？
              {prompts.filter((p) => p.category_id === currentCategory?.id).length > 0 &&
                "注意：此分类下有提示词，删除可能会影响这些提示词。"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteCategoryDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={submitDeleteCategory} disabled={formLoading}>
              {formLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
