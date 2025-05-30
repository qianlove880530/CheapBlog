interface ModelBadgeProps {
  modelId: string
  size?: "sm" | "md" | "lg"
}

// 模型信息映射
const modelInfo: Record<string, { name: string; provider: string; color: string }> = {
  "tngtech/deepseek-r1t-chimera:free": {
    name: "DeepSeek R1T Chimera",
    provider: "TNG Tech",
    color: "green",
  },
  "arliai/qwq-32b-arliai-rpr-v1:free": {
    name: "QWQ 32B",
    provider: "Arli AI",
    color: "blue",
  },
  "nvidia/llama-3.1-nemotron-ultra-253b-v1:free": {
    name: "Llama 3.1 Nemotron Ultra",
    provider: "NVIDIA",
    color: "purple",
  },
  "meta-llama/llama-4-maverick:free": {
    name: "Llama 4 Maverick",
    provider: "Meta",
    color: "indigo",
  },
  "deepseek/deepseek-v3-base:free": {
    name: "DeepSeek V3 Base",
    provider: "DeepSeek",
    color: "orange",
  },
  "deepseek/deepseek-chat-v3-0324:free": {
    name: "DeepSeek Chat V3",
    provider: "DeepSeek",
    color: "amber",
  },
  "google/gemini-2.0-flash-exp:free": {
    name: "Gemini 2.0 Flash",
    provider: "Google",
    color: "red",
  },
}

export function ModelBadge({ modelId, size = "md" }: ModelBadgeProps) {
  const model = modelInfo[modelId] || {
    name: modelId.split("/").pop()?.replace(":free", "") || "未知模型",
    provider: "未知提供商",
    color: "gray",
  }

  const sizeClasses = {
    sm: "text-xs py-0.5 px-1.5",
    md: "text-sm py-1 px-2",
    lg: "text-base py-1.5 px-3",
  }

  return (
    <div
      className={`inline-flex items-center rounded-full ${sizeClasses[size]} bg-${model.color}-100 text-${model.color}-800`}
    >
      <div className={`mr-1 h-1.5 w-1.5 rounded-full bg-${model.color}-500`}></div>
      <span className="font-medium">{model.name}</span>
    </div>
  )
}
