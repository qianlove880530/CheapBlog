import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BlogManager from "@/components/dashboard/blog-manager"
import PromptManager from "@/components/dashboard/prompt-manager"
import KnowledgeManager from "@/components/dashboard/knowledge-manager"
import AIToolManager from "@/components/dashboard/ai-tool-manager"

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">博客管理后台</h1>

      <Tabs defaultValue="content">
        <TabsList className="mb-6">
          <TabsTrigger value="content">博客内容管理</TabsTrigger>
          <TabsTrigger value="prompt">提示词管理</TabsTrigger>
          <TabsTrigger value="knowledge">知识库管理</TabsTrigger>
          <TabsTrigger value="ai-tools">AI工具管理</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <BlogManager />
        </TabsContent>

        <TabsContent value="prompt">
          <PromptManager />
        </TabsContent>

        <TabsContent value="knowledge">
          <KnowledgeManager />
        </TabsContent>

        <TabsContent value="ai-tools">
          <AIToolManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
