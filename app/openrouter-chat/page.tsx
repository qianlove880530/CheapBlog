import { OpenRouterChat } from "@/components/ai/openrouter-chat"

export default function OpenRouterChatPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">OpenRouter AI 聊天</h1>
      <OpenRouterChat />
    </div>
  )
}
