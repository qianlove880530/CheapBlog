"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronRight, Edit, Trash2, Plus, Search, Loader2, FileEdit, FileText } from "lucide-react"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  TableIcon,
  Link,
  ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  CheckSquare,
} from "lucide-react"
import type { Node } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function BlogManager() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false)
  const [currentNode, setCurrentNode] = useState<Node | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    name_en: "",
    type: "category1",
    parent_id: null as string | null,
    content: "",
    content_en: "",
  })
  const [formLoading, setFormLoading] = useState(false)
  const [selectedTab, setSelectedTab] = useState("edit")
  const [selectedLanguageTab, setSelectedLanguageTab] = useState("zh")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const textareaEnRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchNodes()
  }, [])

  const fetchNodes = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/nodes")
      if (!response.ok) {
        throw new Error("获取数据失败")
      }
      const data = await response.json()
      setNodes(data)
    } catch (err: any) {
      setError(err.message)
      console.error("获取节点失败:", err)
      toast({
        variant: "destructive",
        title: "错误",
        description: `获取数据失败: ${err.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

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

  const handleAddNode = () => {
    setFormData({
      name: "",
      name_en: "",
      type: "category1",
      parent_id: null,
      content: "",
      content_en: "",
    })
    setIsAddDialogOpen(true)
  }

  const handleEditNode = (node: Node) => {
    setCurrentNode(node)
    setFormData({
      name: node.name,
      name_en: node.name_en || node.name,
      type: node.type,
      parent_id: node.parent_id,
      content: node.content || "",
      content_en: node.content_en || node.content || "",
    })

    if (node.type === "category3") {
      setIsContentDialogOpen(true)
    } else {
      setIsEditDialogOpen(true)
    }
  }

  const handleDeleteNode = (node: Node) => {
    setCurrentNode(node)
    setIsDeleteDialogOpen(true)
  }

  const handleAddContent = (parentId: string) => {
    setCurrentNode(null)
    setFormData({
      name: "",
      name_en: "",
      type: "category3",
      parent_id: parentId,
      content: "",
      content_en: "",
    })
    setIsContentDialogOpen(true)
  }

  const submitAddNode = async () => {
    try {
      setFormLoading(true)
      const response = await fetch("/api/nodes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "添加失败")
      }

      await fetchNodes()
      setIsAddDialogOpen(false)
      toast({
        title: "成功",
        description: "节点添加成功",
      })
    } catch (err: any) {
      console.error("添加节点失败:", err)
      toast({
        variant: "destructive",
        title: "错误",
        description: `添加失败: ${err.message}`,
      })
    } finally {
      setFormLoading(false)
    }
  }

  const submitEditNode = async () => {
    if (!currentNode) return

    try {
      setFormLoading(true)
      const response = await fetch(`/api/nodes/${currentNode.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "更新失败")
      }

      await fetchNodes()
      setIsEditDialogOpen(false)
      toast({
        title: "成功",
        description: "节点更新成功",
      })
    } catch (err: any) {
      console.error("更新节点失败:", err)
      toast({
        variant: "destructive",
        title: "错误",
        description: `更新失败: ${err.message}`,
      })
    } finally {
      setFormLoading(false)
    }
  }

  const submitDeleteNode = async () => {
    if (!currentNode) return

    try {
      setFormLoading(true)
      const response = await fetch(`/api/nodes/${currentNode.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "删除失败")
      }

      await fetchNodes()
      setIsDeleteDialogOpen(false)
      toast({
        title: "成功",
        description: "节点删除成功",
      })
    } catch (err: any) {
      console.error("删除节点失败:", err)
      toast({
        variant: "destructive",
        title: "错误",
        description: `删除失败: ${err.message}`,
      })
    } finally {
      setFormLoading(false)
    }
  }

  const submitContentEdit = async () => {
    try {
      setFormLoading(true)

      if (currentNode) {
        // 更新现有内容
        const response = await fetch(`/api/nodes/${currentNode.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            name_en: formData.name_en,
            content: formData.content,
            content_en: formData.content_en,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "更新失败")
        }
      } else {
        // 创建新内容
        const response = await fetch("/api/nodes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "创建失败")
        }
      }

      await fetchNodes()
      setIsContentDialogOpen(false)
      toast({
        title: "成功",
        description: currentNode ? "内容已更新" : "内容已创建",
      })
    } catch (err: any) {
      console.error("保存内容失败:", err)
      toast({
        variant: "destructive",
        title: "错误",
        description: `保存失败: ${err.message}`,
      })
    } finally {
      setFormLoading(false)
    }
  }

  // 插入Markdown格式文本
  const insertMarkdown = (prefix: string, suffix = "") => {
    const isEnglish = selectedLanguageTab === "en"
    const textarea = isEnglish ? textareaEnRef.current : textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const content = isEnglish ? formData.content_en : formData.content
    const selectedText = content.substring(start, end)
    const beforeText = content.substring(0, start)
    const afterText = content.substring(end)

    const newText = beforeText + prefix + (selectedText || (isEnglish ? "text" : "文本")) + suffix + afterText

    if (isEnglish) {
      setFormData({ ...formData, content_en: newText })
    } else {
      setFormData({ ...formData, content: newText })
    }

    // 设置光标位置
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = selectedText
        ? start + prefix.length + selectedText.length + suffix.length
        : start + prefix.length + 2
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  // 插入表格
  const insertTable = () => {
    const isEnglish = selectedLanguageTab === "en"
    const textarea = isEnglish ? textareaEnRef.current : textareaRef.current
    if (!textarea) return

    const tableTemplate = isEnglish
      ? `
| Header 1 | Header 2 | Header 3 |
| ----- | ----- | ----- |
| Content 1 | Content 2 | Content 3 |
| Content 4 | Content 5 | Content 6 |
`
      : `
| 标题1 | 标题2 | 标题 3 |
| ----- | ----- | ----- |
| 内容1 | 内容2 | 内容3 |
| 内容4 | 内容5 | 内容6 |
`

    const start = textarea.selectionStart
    const content = isEnglish ? formData.content_en : formData.content
    const beforeText = content.substring(0, start)
    const afterText = content.substring(start)

    const newText = beforeText + tableTemplate + afterText

    if (isEnglish) {
      setFormData({ ...formData, content_en: newText })
    } else {
      setFormData({ ...formData, content: newText })
    }

    // 设置光标位置
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + tableTemplate.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  // 插入代码块
  const insertCodeBlock = () => {
    const codeTemplate = "```\n" + (selectedLanguageTab === "en" ? "code block" : "代码块") + "\n```"
    insertMarkdown(codeTemplate, "")
  }

  // 插入引用
  const insertQuote = () => {
    insertMarkdown("> ", "")
  }

  // 插入任务列表
  const insertTaskList = () => {
    const isEnglish = selectedLanguageTab === "en"
    const textarea = isEnglish ? textareaEnRef.current : textareaRef.current
    if (!textarea) return

    const taskTemplate = isEnglish
      ? "- [ ] Task 1\n- [ ] Task 2\n- [ ] Task 3"
      : "- [ ] 任务1\n- [ ] 任务2\n- [ ] 任务3"

    const start = textarea.selectionStart
    const content = isEnglish ? formData.content_en : formData.content
    const beforeText = content.substring(0, start)
    const afterText = content.substring(start)

    const newText = beforeText + taskTemplate + afterText

    if (isEnglish) {
      setFormData({ ...formData, content_en: newText })
    } else {
      setFormData({ ...formData, content: newText })
    }

    // 设置光标位置
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + taskTemplate.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
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

  // 获取可选的父节点
  const getParentOptions = () => {
    if (formData.type === "category1") {
      return []
    } else if (formData.type === "category2") {
      return nodes.filter((node) => node.type === "category1")
    } else if (formData.type === "category3") {
      return nodes.filter((node) => node.type === "category2")
    }
    return []
  }

  // 格式化创建时间
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  if (loading && nodes.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">加载中...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索节点..."
            className="pl-8 rounded-lg border-pink-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          className="rounded-lg bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600"
          onClick={handleAddNode}
        >
          <Plus className="mr-2 h-4 w-4" />
          添加节点
        </Button>
      </div>

      <Card className="rounded-xl shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gradient-to-r from-pink-50 to-amber-50">
              <TableRow>
                <TableHead className="w-[50%]">名称</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topLevelCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    暂无数据
                  </TableCell>
                </TableRow>
              ) : (
                topLevelCategories.map((category) => (
                  <>
                    <TableRow key={category.id} className="hover:bg-pink-50/50">
                      <TableCell>
                        <button className="flex items-center gap-2" onClick={() => toggleCategory(category.id)}>
                          {expandedCategories.includes(category.id) ? (
                            <ChevronDown size={16} className="text-pink-500" />
                          ) : (
                            <ChevronRight size={16} className="text-pink-500" />
                          )}
                          <span className="font-medium">{category.name}</span>
                          {category.name_en && (
                            <span className="text-xs text-muted-foreground ml-2">({category.name_en})</span>
                          )}
                        </button>
                      </TableCell>
                      <TableCell>一级分类</TableCell>
                      <TableCell>{formatDate(category.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-amber-600 hover:bg-amber-50"
                            onClick={() => handleEditNode(category)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-pink-50"
                            onClick={() => handleDeleteNode(category)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {expandedCategories.includes(category.id) &&
                      getSubcategories(category.id).map((subcategory) => (
                        <>
                          <TableRow key={subcategory.id} className="hover:bg-amber-50/50">
                            <TableCell>
                              <button
                                className="flex items-center gap-2 pl-6"
                                onClick={() => toggleSubcategory(subcategory.id)}
                              >
                                {expandedSubcategories.includes(subcategory.id) ? (
                                  <ChevronDown size={16} className="text-amber-500" />
                                ) : (
                                  <ChevronRight size={16} className="text-amber-500" />
                                )}
                                <span className="font-medium">{subcategory.name}</span>
                                {subcategory.name_en && (
                                  <span className="text-xs text-muted-foreground ml-2">({subcategory.name_en})</span>
                                )}
                              </button>
                            </TableCell>
                            <TableCell>二级分类</TableCell>
                            <TableCell>{formatDate(subcategory.created_at)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-green-600 hover:bg-green-50"
                                  onClick={() => handleAddContent(subcategory.id)}
                                  title="添加内容"
                                >
                                  <Plus size={16} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-amber-600 hover:bg-amber-50"
                                  onClick={() => handleEditNode(subcategory)}
                                >
                                  <Edit size={16} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:bg-pink-50"
                                  onClick={() => handleDeleteNode(subcategory)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>

                          {expandedSubcategories.includes(subcategory.id) &&
                            getThirdLevelCategories(subcategory.id).map((content) => (
                              <TableRow key={content.id} className="hover:bg-teal-50/50">
                                <TableCell>
                                  <div className="flex items-center gap-2 pl-12">
                                    <FileText size={16} className="text-teal-500" />
                                    <span>{content.name}</span>
                                    {content.name_en && (
                                      <span className="text-xs text-muted-foreground ml-2">({content.name_en})</span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>内容</TableCell>
                                <TableCell>{formatDate(content.created_at)}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                                      onClick={() => handleEditNode(content)}
                                      title="编辑内容"
                                    >
                                      <FileEdit size={16} />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-destructive hover:bg-pink-50"
                                      onClick={() => handleDeleteNode(content)}
                                    >
                                      <Trash2 size={16} />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </>
                      ))}
                  </>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 添加节点对话框 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>添加节点</DialogTitle>
            <DialogDescription>添加新的分类节点。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Tabs value={selectedLanguageTab} onValueChange={setSelectedLanguageTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="zh" className="flex items-center">
                  <span className="mr-2">🇨🇳</span> 中文
                </TabsTrigger>
                <TabsTrigger value="en" className="flex items-center">
                  <span className="mr-2">🇬🇧</span> English
                </TabsTrigger>
              </TabsList>

              <TabsContent value="zh">
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
              </TabsContent>

              <TabsContent value="en">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name_en" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name_en"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                类型
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as any, parent_id: null })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="category1">一级分类</SelectItem>
                  <SelectItem value="category2">二级分类</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.type !== "category1" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="parent" className="text-right">
                  父节点
                </Label>
                <Select
                  value={formData.parent_id || undefined}
                  onValueChange={(value) => setFormData({ ...formData, parent_id: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择父节点" />
                  </SelectTrigger>
                  <SelectContent>
                    {getParentOptions().map((node) => (
                      <SelectItem key={node.id} value={node.id}>
                        {node.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={submitAddNode} disabled={formLoading}>
              {formLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑节点对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>编辑节点</DialogTitle>
            <DialogDescription>修改节点信息。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Tabs value={selectedLanguageTab} onValueChange={setSelectedLanguageTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="zh" className="flex items-center">
                  <span className="mr-2">🇨🇳</span> 中文
                </TabsTrigger>
                <TabsTrigger value="en" className="flex items-center">
                  <span className="mr-2">🇬🇧</span> English
                </TabsTrigger>
              </TabsList>

              <TabsContent value="zh">
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
              </TabsContent>

              <TabsContent value="en">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name-en" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="edit-name-en"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">
                类型
              </Label>
              <Input
                id="edit-type"
                value={formData.type === "category1" ? "一级分类" : formData.type === "category2" ? "二级分类" : "内容"}
                disabled
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={submitEditNode} disabled={formLoading}>
              {formLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 内容编辑对话框 */}
      <Dialog open={isContentDialogOpen} onOpenChange={setIsContentDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentNode ? "编辑内容" : "添加内容"}</DialogTitle>
            <DialogDescription>{currentNode ? "修改内容信息和Markdown内容。" : "添加新的内容节点。"}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Tabs value={selectedLanguageTab} onValueChange={setSelectedLanguageTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="zh" className="flex items-center">
                  <span className="mr-2">🇨🇳</span> 中文
                </TabsTrigger>
                <TabsTrigger value="en" className="flex items-center">
                  <span className="mr-2">🇬🇧</span> English
                </TabsTrigger>
              </TabsList>

              <TabsContent value="zh">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="content-name" className="text-right">
                    标题
                  </Label>
                  <Input
                    id="content-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </TabsContent>

              <TabsContent value="en">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="content-name-en" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="content-name-en"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-1 items-start gap-4">
              <Label htmlFor="content-markdown">内容</Label>
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="mb-2">
                  <TabsTrigger value="edit">编辑</TabsTrigger>
                  <TabsTrigger value="preview">预览</TabsTrigger>
                </TabsList>

                <TabsContent value="edit">
                  <div className="mb-2 flex items-center overflow-x-auto whitespace-nowrap gap-2 p-2 bg-gradient-to-r from-pink-50 to-amber-50 rounded-md border border-amber-200 shadow-sm">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="bg-white hover:bg-gray-50"
                            onClick={() => insertMarkdown("**", "**")}
                          >
                            <Bold className="h-4 w-4 text-pink-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>加粗</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="bg-white hover:bg-gray-50"
                            onClick={() => insertMarkdown("*", "*")}
                          >
                            <Italic className="h-4 w-4 text-amber-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>斜体</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <div className="h-6 w-px bg-gray-300 mx-1"></div>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="bg-white hover:bg-gray-50"
                            onClick={() => insertMarkdown("# ")}
                          >
                            <Heading1 className="h-4 w-4 text-blue-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>一级标题</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="bg-white hover:bg-gray-50"
                            onClick={() => insertMarkdown("## ")}
                          >
                            <Heading2 className="h-4 w-4 text-blue-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>二级标题</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="bg-white hover:bg-gray-50"
                            onClick={() => insertMarkdown("### ")}
                          >
                            <Heading3 className="h-4 w-4 text-blue-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>三级标题</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <div className="h-6 w-px bg-gray-300 mx-1"></div>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="bg-white hover:bg-gray-50"
                            onClick={() => insertMarkdown("- ")}
                          >
                            <List className="h-4 w-4 text-green-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>无序列表</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="bg-white hover:bg-gray-50"
                            onClick={() => insertMarkdown("1. ")}
                          >
                            <ListOrdered className="h-4 w-4 text-green-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>有序列表</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="bg-white hover:bg-gray-50"
                            onClick={insertTaskList}
                          >
                            <CheckSquare className="h-4 w-4 text-purple-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>任务列表</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <div className="h-6 w-px bg-gray-300 mx-1"></div>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="bg-white hover:bg-gray-50"
                            onClick={insertTable}
                          >
                            <TableIcon className="h-4 w-4 text-teal-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>表格</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="bg-white hover:bg-gray-50"
                            onClick={insertCodeBlock}
                          >
                            <Code className="h-4 w-4 text-gray-700" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>代码块</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="bg-white hover:bg-gray-50"
                            onClick={insertQuote}
                          >
                            <Quote className="h-4 w-4 text-orange-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>引用</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <div className="h-6 w-px bg-gray-300 mx-1"></div>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="bg-white hover:bg-gray-50"
                            onClick={() => insertMarkdown("[链接文本](", ")")}
                          >
                            <Link className="h-4 w-4 text-indigo-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>链接</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="bg-white hover:bg-gray-50"
                            onClick={() => insertMarkdown("![图片描述](", ")")}
                          >
                            <ImageIcon className="h-4 w-4 text-rose-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>图片</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <div className="h-6 w-px bg-gray-300 mx-1"></div>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="bg-white hover:bg-gray-50"
                            onClick={() => insertMarkdown('<div style="text-align: left;">', "</div>")}
                          >
                            <AlignLeft className="h-4 w-4 text-cyan-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>左对齐</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="bg-white hover:bg-gray-50"
                            onClick={() => insertMarkdown('<div style="text-align: center;">', "</div>")}
                          >
                            <AlignCenter className="h-4 w-4 text-cyan-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>居中对齐</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="bg-white hover:bg-gray-50"
                            onClick={() => insertMarkdown('<div style="text-align: right;">', "</div>")}
                          >
                            <AlignRight className="h-4 w-4 text-cyan-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>右对齐</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <Tabs value={selectedLanguageTab} className="w-full">
                    <TabsList className="grid grid-cols-2 mb-2">
                      <TabsTrigger value="zh" className="flex items-center">
                        <span className="mr-2">🇨🇳</span> 中文
                      </TabsTrigger>
                      <TabsTrigger value="en" className="flex items-center">
                        <span className="mr-2">🇬🇧</span> English
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="zh">
                      <Textarea
                        ref={textareaRef}
                        className="w-full min-h-[300px] p-4 rounded-lg border border-amber-200 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono"
                        placeholder="在这里使用Markdown编写中文内容..."
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      />
                    </TabsContent>

                    <TabsContent value="en">
                      <Textarea
                        ref={textareaEnRef}
                        className="w-full min-h-[300px] p-4 rounded-lg border border-amber-200 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono"
                        placeholder="Write your English content in Markdown here..."
                        value={formData.content_en}
                        onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                      />
                    </TabsContent>
                  </Tabs>
                </TabsContent>

                <TabsContent value="preview">
                  <Tabs value={selectedLanguageTab} className="w-full">
                    <TabsList className="grid grid-cols-2 mb-2">
                      <TabsTrigger value="zh" className="flex items-center">
                        <span className="mr-2">🇨🇳</span> 中文
                      </TabsTrigger>
                      <TabsTrigger value="en" className="flex items-center">
                        <span className="mr-2">🇬🇧</span> English
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="zh">
                      <div className="w-full min-h-[300px] p-4 rounded-lg border border-teal-200 bg-background overflow-auto">
                        <div className="prose dark:prose-invert max-w-none">
                          {formData.content ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{formData.content}</ReactMarkdown>
                          ) : (
                            <p className="text-muted-foreground">预览区域为空，请在编辑模式下添加内容。</p>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="en">
                      <div className="w-full min-h-[300px] p-4 rounded-lg border border-teal-200 bg-background overflow-auto">
                        <div className="prose dark:prose-invert max-w-none">
                          {formData.content_en ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{formData.content_en}</ReactMarkdown>
                          ) : (
                            <p className="text-muted-foreground">
                              Preview area is empty, please add content in edit mode.
                            </p>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsContentDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={submitContentEdit} disabled={formLoading}>
              {formLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              您确定要删除"{currentNode?.name}"吗？此操作不可撤销，删除后所有子节点也将被删除。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={submitDeleteNode} disabled={formLoading}>
              {formLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
