"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Save,
  Eye,
  Code,
  Bold,
  Italic,
  List,
  ListOrdered,
  Table,
  Link,
  ImageIcon,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MarkdownEditorProps {
  initialValue?: string
  onSave?: (content: string) => Promise<void>
  readOnly?: boolean
  className?: string
}

export default function MarkdownEditor({
  initialValue = "",
  onSave,
  readOnly = false,
  className = "",
}: MarkdownEditorProps) {
  const [content, setContent] = useState(initialValue)
  const [selectedTab, setSelectedTab] = useState("edit")
  const [saving, setSaving] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setContent(initialValue)
  }, [initialValue])

  const handleSave = async () => {
    if (onSave) {
      setSaving(true)
      try {
        await onSave(content)
      } catch (error) {
        console.error("保存失败:", error)
      } finally {
        setSaving(false)
      }
    }
  }

  const insertMarkdown = (prefix: string, suffix = "") => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const beforeText = content.substring(0, start)
    const afterText = content.substring(end)

    const newText = beforeText + prefix + selectedText + suffix + afterText
    setContent(newText)

    // 设置光标位置
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, end + prefix.length)
    }, 0)
  }

  const insertTable = () => {
    const tableTemplate = `
| 标题1 | 标题2 | 标题3 |
| ----- | ----- | ----- |
| 内容1 | 内容2 | 内容3 |
| 内容4 | 内容5 | 内容6 |
`
    insertMarkdown(tableTemplate)
  }

  return (
    <Card className={`rounded-xl shadow-lg ${className}`}>
      <CardContent className="p-4">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList className="rounded-lg bg-gradient-to-r from-pink-100 to-amber-100">
              <TabsTrigger
                value="edit"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-200 data-[state=active]:to-amber-200 data-[state=active]:text-pink-900"
              >
                <Code className="mr-2 h-4 w-4" />
                编辑
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-200 data-[state=active]:to-teal-200 data-[state=active]:text-amber-900"
              >
                <Eye className="mr-2 h-4 w-4" />
                预览
              </TabsTrigger>
            </TabsList>

            {!readOnly && (
              <Button
                className="rounded-lg bg-gradient-to-r from-teal-500 to-pink-500 hover:from-teal-600 hover:to-pink-600"
                onClick={handleSave}
                disabled={saving}
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? "保存中..." : "保存"}
              </Button>
            )}
          </div>

          {!readOnly && selectedTab === "edit" && (
            <div className="mb-2 flex flex-wrap gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => insertMarkdown("**", "**")}>
                      <Bold className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>加粗</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => insertMarkdown("*", "*")}>
                      <Italic className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>斜体</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => insertMarkdown("# ")}>
                      <Heading1 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>一级标题</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => insertMarkdown("## ")}>
                      <Heading2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>二级标题</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => insertMarkdown("### ")}>
                      <Heading3 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>三级标题</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => insertMarkdown("- ")}>
                      <List className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>无序列表</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => insertMarkdown("1. ")}>
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>有序列表</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={insertTable}>
                      <Table className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>表格</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => insertMarkdown("[链接文本](", ")")}>
                      <Link className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>链接</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => insertMarkdown("![图片描述](", ")")}>
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>图片</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          <TabsContent value="edit" className="mt-0">
            <Textarea
              ref={textareaRef}
              className="w-full min-h-[500px] p-4 rounded-lg border border-amber-200 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono"
              placeholder="在这里使用Markdown编写文章内容..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              readOnly={readOnly}
            />
          </TabsContent>

          <TabsContent value="preview" className="mt-0">
            <div className="w-full min-h-[500px] p-4 rounded-lg border border-teal-200 bg-background overflow-auto">
              <div className="prose dark:prose-invert max-w-none">
                {content ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                ) : (
                  <p className="text-muted-foreground">预览区域为空，请在编辑模式下添加内容。</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
