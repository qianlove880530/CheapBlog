import AIChat from "@/components/ai/ai-chat"

export default function AIDemoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-amber-600 to-teal-600 bg-clip-text text-transparent">
        AI助手演示
      </h1>
      <p className="text-muted-foreground mb-6">
        这个AI助手使用Groq的deepseek-r1-distill-llama-70b模型，可以回答您的问题并提供帮助。
      </p>
      <div className="max-w-3xl mx-auto">
        <AIChat
          title="DeepSeek AI助手"
          placeholder="有什么可以帮助您的？"
          systemPrompt="你是一个专业、友好的AI助手，基于DeepSeek R1 Distill Llama 70B模型。你的回答应该简洁、准确、有帮助。"
        />
      </div>
    </div>
  )
}
