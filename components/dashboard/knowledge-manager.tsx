"use client"

import { Textarea } from "@/components/ui/textarea"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  Plus,
  Search,
  Loader2,
  Files,
  FileText,
  FileUp,
  Library,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

// 知识库类型定义
interface KnowledgeBase {
  id: string
  name: string
  description: string
  file_count: number
  created_at: string
  updated_at: string
}

// 知识库文件类型定义
interface KnowledgeFile {
  id: string
  name: string
  type: string
  size: number
  kb_id: string
  created_at: string
  status: "ready" | "processing" | "failed"
}

// 模拟数据 - 在实际项目中，这些数据会从API获取
const mockKnowledgeBases: KnowledgeBase[] = [
  {
    id: "kb1",
    name: "AI基础知识",
    description: "包含机器学习、深度学习和大型语言模型的基础知识",
    file_count: 3,
    created_at: "2023-10-15T10:30:00Z",
    updated_at: "2023-10-17T14:20:00Z",
  },
  {
    id: "kb2",
    name: "编程指南",
    description: "各种编程语言和框架的指南和最佳实践",
    file_count: 5,
    created_at: "2023-10-16T11:45:00Z",
    updated_at: "2023-10-18T09:30:00Z",
  },
  {
    id: "kb3",
    name: "产品规格文档",
    description: "产品功能、API规格和使用说明",
    file_count: 2,
    created_at: "2023-10-18T14:20:00Z",
    updated_at: "2023-10-18T14:20:00Z",
  },
]

const mockKnowledgeFiles: Record<string, KnowledgeFile[]> = {
  kb1: [
    {
      id: "f1",
      name: "机器学习基础.pdf",
      type: "PDF",
      size: 2500000,
      kb_id: "kb1",
      created_at: "2023-10-15T10:35:00Z",
      status: "ready",
    },
    {
      id: "f2",
      name: "深度学习入门.docx",
      type: "DOCX",
      size: 1800000,
      kb_id: "kb1",
      created_at: "2023-10-16T09:20:00Z",
      status: "ready",
    },
    {
      id: "f3",
      name: "大型语言模型概述.pdf",
      type: "PDF",
      size: 3200000,
      kb_id: "kb1",
      created_at: "2023-10-17T14:15:00Z",
      status: "ready",
    },
  ],
  kb2: [
    {
      id: "f4",
      name: "Python编程指南.pdf",
      type: "PDF",
      size: 4100000,
      kb_id: "kb2",
      created_at: "2023-10-16T11:50:00Z",
      status: "ready",
    },
    {
      id: "f5",
      name: "JavaScript最佳实践.md",
      type: "MD",
      size: 850000,
      kb_id: "kb2",
      created_at: "2023-10-17T10:25:00Z",
      status: "ready",
    },
    {
      id: "f6",
      name: "React框架入门.pdf",
      type: "PDF",
      size: 2200000,
      kb_id: "kb2",
      created_at: "2023-10-17T15:40:00Z",
      status: "ready",
    },
    {
      id: "f7",
      name: "数据结构与算法.pdf",
      type: "PDF",
      size: 3800000,
      kb_id: "kb2",
      created_at: "2023-10-18T09:25:00Z",
      status: "ready",
    },
    {
      id: "f8",
      name: "Go语言开发指南.docx",
      type: "DOCX",
      size: 1650000,
      kb_id: "kb2",
      created_at: "2023-10-18T09:30:00Z",
      status: "processing",
    },
  ],
  kb3: [
    {
      id: "f9",
      name: "API规格文档.pdf",
      type: "PDF",
      size: 1950000,
      kb_id: "kb3",
      created_at: "2023-10-18T14:20:00Z",
      status: "ready",
    },
    {
      id: "f10",
      name: "产品使用手册.pdf",
      type: "PDF",
      size: 5300000,
      kb_id: "kb3",
      created_at: "2023-10-18T14:20:00Z",
      status: "ready",
    },
  ],
}

export default function KnowledgeManager() {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>(mockKnowledgeBases)
  const [knowledgeFiles, setKnowledgeFiles] = useState<Record<string, KnowledgeFile[]>>(mockKnowledgeFiles)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [expandedKBs, setExpandedKBs] = useState<string[]>([])

  // 对话框状态
  const [isAddKBDialogOpen, setIsAddKBDialogOpen] = useState(false)
  const [isEditKBDialogOpen, setIsEditKBDialogOpen] = useState(false)
  const [isDeleteKBDialogOpen, setIsDeleteKBDialogOpen] = useState(false)
  const [isUploadFileDialogOpen, setIsUploadFileDialogOpen] = useState(false)
  const [currentKB, setCurrentKB] = useState<KnowledgeBase | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [formLoading, setFormLoading] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  const { toast } = useToast()

  // 过滤知识库
  const filteredKBs = knowledgeBases.filter((kb) => {
    return (
      searchTerm === "" ||
      kb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kb.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB"
    else return (bytes / 1073741824).toFixed(1) + " GB"
  }

  // 切换知识库展开状态
  const toggleKBExpansion = (kbId: string) => {
    setExpandedKBs((prev) => (prev.includes(kbId) ? prev.filter((id) => id !== kbId) : [...prev, kbId]))
  }

  // 添加知识库
  const handleAddKB = () => {
    setFormData({
      name: "",
      description: "",
    })
    setIsAddKBDialogOpen(true)
  }

  // 编辑知识库
  const handleEditKB = (kb: KnowledgeBase) => {
    setCurrentKB(kb)
    setFormData({
      name: kb.name,
      description: kb.description,
    })
    setIsEditKBDialogOpen(true)
  }

  // 删除知识库
  const handleDeleteKB = (kb: KnowledgeBase) => {
    setCurrentKB(kb)
    setIsDeleteKBDialogOpen(true)
  }

  // 上传文件到知识库
  const handleUploadFile = (kb: KnowledgeBase) => {
    setCurrentKB(kb)
    setUploadFile(null)
    setUploadProgress(0)
    setIsUploadFileDialogOpen(true)
  }

  // 删除文件
  const handleDeleteFile = (kb: KnowledgeBase, file: KnowledgeFile) => {
    // 在实际应用中，这里会调用API
    const updatedFiles = { ...knowledgeFiles }
    updatedFiles[kb.id] = updatedFiles[kb.id].filter((f) => f.id !== file.id)

    setKnowledgeFiles(updatedFiles)

    // 更新知识库文件数量
    const updatedKBs = knowledgeBases.map((k) => {
      if (k.id === kb.id) {
        return {
          ...k,
          file_count: k.file_count - 1,
        }
      }
      return k
    })

    setKnowledgeBases(updatedKBs)

    toast({
      title: "成功",
      description: "文件已删除",
    })
  }

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0])
    }
  }

  // 提交添加知识库
  const submitAddKB = () => {
    setFormLoading(true)

    // 在实际应用中，这里会调用API
    setTimeout(() => {
      const newKB: KnowledgeBase = {
        id: `kb${knowledgeBases.length + 1}`,
        name: formData.name,
        description: formData.description,
        file_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      setKnowledgeBases([...knowledgeBases, newKB])
      setKnowledgeFiles({
        ...knowledgeFiles,
        [newKB.id]: [],
      })
      setIsAddKBDialogOpen(false)
      setFormLoading(false)

      toast({
        title: "成功",
        description: "知识库创建成功",
      })
    }, 1000)
  }

  // 提交编辑知识库
  const submitEditKB = () => {
    if (!currentKB) return

    setFormLoading(true)

    // 在实际应用中，这里会调用API
    setTimeout(() => {
      const updatedKBs = knowledgeBases.map((kb) => {
        if (kb.id === currentKB.id) {
          return {
            ...kb,
            name: formData.name,
            description: formData.description,
            updated_at: new Date().toISOString(),
          }
        }
        return kb
      })

      setKnowledgeBases(updatedKBs)
      setIsEditKBDialogOpen(false)
      setFormLoading(false)

      toast({
        title: "成功",
        description: "知识库更新成功",
      })
    }, 1000)
  }

  // 提交删除知识库
  const submitDeleteKB = () => {
    if (!currentKB) return

    setFormLoading(true)

    // 在实际应用中，这里会调用API
    setTimeout(() => {
      const updatedKBs = knowledgeBases.filter((kb) => kb.id !== currentKB.id)

      // 删除关联的文件
      const updatedFiles = { ...knowledgeFiles }
      delete updatedFiles[currentKB.id]

      setKnowledgeBases(updatedKBs)
      setKnowledgeFiles(updatedFiles)
      setIsDeleteKBDialogOpen(false)
      setFormLoading(false)

      toast({
        title: "成功",
        description: "知识库删除成功",
      })
    }, 1000)
  }

  // 提交文件上传
  const submitFileUpload = () => {
    if (!currentKB || !uploadFile) return

    setFormLoading(true)

    // 模拟上传进度
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 300)

    // 在实际应用中，这里会调用API
    setTimeout(() => {
      clearInterval(interval)

      const newFile: KnowledgeFile = {
        id: `f${Object.values(knowledgeFiles).flat().length + 1}`,
        name: uploadFile.name,
        type: uploadFile.name.split(".").pop()?.toUpperCase() || "UNKNOWN",
        size: uploadFile.size,
        kb_id: currentKB.id,
        created_at: new Date().toISOString(),
        status: "ready",
      }

      // 更新文件列表
      setKnowledgeFiles({
        ...knowledgeFiles,
        [currentKB.id]: [...(knowledgeFiles[currentKB.id] || []), newFile],
      })

      // 更新知识库文件数量
      const updatedKBs = knowledgeBases.map((kb) => {
        if (kb.id === currentKB.id) {
          return {
            ...kb,
            file_count: kb.file_count + 1,
            updated_at: new Date().toISOString(),
          }
        }
        return kb
      })

      setKnowledgeBases(updatedKBs)
      setIsUploadFileDialogOpen(false)
      setFormLoading(false)
      setUploadProgress(0)

      toast({
        title: "成功",
        description: "文件上传成功",
      })
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">知识库管理</h2>
          <p className="text-sm text-muted-foreground">管理AI的专业知识库，提供准确高效的领域专业回答</p>
        </div>
        <Button
          onClick={handleAddKB}
          className="rounded-lg bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          创建知识库
        </Button>
      </div>

      <div className="flex items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索知识库..."
            className="pl-8 rounded-lg border-teal-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="rounded-xl shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gradient-to-r from-teal-50 to-green-50">
              <TableRow>
                <TableHead className="w-[40%]">知识库</TableHead>
                <TableHead className="w-[20%]">文件数量</TableHead>
                <TableHead className="w-[20%]">更新时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKBs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    {loading ? (
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-8 w-8 animate-spin text-teal-500 mr-2" />
                        加载中...
                      </div>
                    ) : (
                      "暂无知识库"
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredKBs.map((kb) => (
                  <>
                    <TableRow key={kb.id} className="hover:bg-teal-50/50">
                      <TableCell>
                        <button className="flex items-center gap-2" onClick={() => toggleKBExpansion(kb.id)}>
                          {expandedKBs.includes(kb.id) ? (
                            <ChevronDown size={16} className="text-teal-500" />
                          ) : (
                            <ChevronRight size={16} className="text-teal-500" />
                          )}
                          <Library className="h-5 w-5 text-teal-500" />
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{kb.name}</span>
                            <span className="text-xs text-muted-foreground">{kb.description}</span>
                          </div>
                        </button>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                          {kb.file_count} 个文件
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(kb.updated_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                            onClick={() => handleUploadFile(kb)}
                          >
                            <FileUp size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-teal-600 hover:bg-teal-50"
                            onClick={() => handleEditKB(kb)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-pink-50"
                            onClick={() => handleDeleteKB(kb)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* 知识库文件列表 */}
                    {expandedKBs.includes(kb.id) && (
                      <TableRow>
                        <TableCell colSpan={4} className="bg-gray-50 p-0">
                          <div className="p-4">
                            <h4 className="text-sm font-medium mb-2">文件列表</h4>
                            {(knowledgeFiles[kb.id] || []).length === 0 ? (
                              <div className="text-center py-4 text-sm text-muted-foreground">
                                暂无文件，请点击上传按钮添加文件
                              </div>
                            ) : (
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-[40%]">文件名</TableHead>
                                    <TableHead className="w-[15%]">类型</TableHead>
                                    <TableHead className="w-[15%]">大小</TableHead>
                                    <TableHead className="w-[15%]">状态</TableHead>
                                    <TableHead className="text-right">操作</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {(knowledgeFiles[kb.id] || []).map((file) => (
                                    <TableRow key={file.id}>
                                      <TableCell>
                                        <div className="flex items-center gap-2">
                                          <FileText size={16} className="text-blue-500" />
                                          <span>{file.name}</span>
                                        </div>
                                      </TableCell>
                                      <TableCell>{file.type}</TableCell>
                                      <TableCell>{formatFileSize(file.size)}</TableCell>
                                      <TableCell>
                                        {file.status === "ready" && (
                                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                            已就绪
                                          </Badge>
                                        )}
                                        {file.status === "processing" && (
                                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                                            处理中
                                          </Badge>
                                        )}
                                        {file.status === "failed" && (
                                          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">失败</Badge>
                                        )}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 text-destructive hover:bg-red-50"
                                          onClick={() => handleDeleteFile(kb, file)}
                                        >
                                          <Trash2 size={16} />
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 添加知识库对话框 */}
      <Dialog open={isAddKBDialogOpen} onOpenChange={setIsAddKBDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>创建知识库</DialogTitle>
            <DialogDescription>创建新的AI知识库，用于提供专业领域的准确回答。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="kb-name" className="text-right">
                名称
              </Label>
              <Input
                id="kb-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="kb-description" className="text-right pt-2">
                描述
              </Label>
              <Textarea
                id="kb-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="col-span-3"
                placeholder="简要描述该知识库的内容和用途..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddKBDialogOpen(false)}>
              取消
            </Button>
            <Button
              onClick={submitAddKB}
              disabled={formLoading || !formData.name}
              className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600"
            >
              {formLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑知识库对话框 */}
      <Dialog open={isEditKBDialogOpen} onOpenChange={setIsEditKBDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>编辑知识库</DialogTitle>
            <DialogDescription>修改知识库的名称和描述。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-kb-name" className="text-right">
                名称
              </Label>
              <Input
                id="edit-kb-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-kb-description" className="text-right pt-2">
                描述
              </Label>
              <Textarea
                id="edit-kb-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditKBDialogOpen(false)}>
              取消
            </Button>
            <Button
              onClick={submitEditKB}
              disabled={formLoading || !formData.name}
              className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600"
            >
              {formLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除知识库对话框 */}
      <Dialog open={isDeleteKBDialogOpen} onOpenChange={setIsDeleteKBDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              您确定要删除"{currentKB?.name}"知识库吗？此操作无法撤销，并将删除其中的所有文件。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteKBDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={submitDeleteKB} disabled={formLoading}>
              {formLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 上传文件对话框 */}
      <Dialog open={isUploadFileDialogOpen} onOpenChange={setIsUploadFileDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>上传文件</DialogTitle>
            <DialogDescription>将文件上传到"{currentKB?.name}"知识库。支持PDF、DOCX、TXT等文件格式。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
              <Files className="h-10 w-10 text-teal-500 mb-4" />

              {uploadFile ? (
                <div className="flex flex-col items-center">
                  <p className="font-medium">{uploadFile.name}</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(uploadFile.size)}</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => setUploadFile(null)}>
                    更换文件
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-4 text-center">
                    点击或拖拽文件到此区域上传
                    <br />
                    支持PDF、DOCX、TXT等格式
                  </p>
                  <Label
                    htmlFor="file-upload"
                    className="bg-teal-500 text-white rounded-md px-4 py-2 hover:bg-teal-600 cursor-pointer"
                  >
                    选择文件
                  </Label>
                  <Input
                    type="file"
                    id="file-upload"
                    className="sr-only"
                    accept=".pdf,.docx,.doc,.txt,.md"
                    onChange={handleFileChange}
                  />
                </>
              )}
            </div>

            {uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>上传进度</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadFileDialogOpen(false)}>
              取消
            </Button>
            <Button
              onClick={submitFileUpload}
              disabled={formLoading || !uploadFile}
              className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600"
            >
              {formLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              上传
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
