"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// 定义模型类型
export interface Model {
  id: string
  name: string
  provider: string
  description: string
  icon?: React.ReactNode
}

// 定义可用的模型
export const models: Model[] = [
  {
    id: "tngtech/deepseek-r1t-chimera:free",
    name: "DeepSeek R1T Chimera",
    provider: "TNG Tech",
    description: "默认模型",
  },
  {
    id: "arliai/qwq-32b-arliai-rpr-v1:free",
    name: "QWQ 32B",
    provider: "Arli AI",
    description: "高性能通用模型",
  },
  {
    id: "nvidia/llama-3.1-nemotron-ultra-253b-v1:free",
    name: "Llama 3.1 Nemotron Ultra",
    provider: "NVIDIA",
    description: "超大规模模型",
  },
  {
    id: "meta-llama/llama-4-maverick:free",
    name: "Llama 4 Maverick",
    provider: "Meta",
    description: "最新Llama系列模型",
  },
  {
    id: "deepseek/deepseek-v3-base:free",
    name: "DeepSeek V3 Base",
    provider: "DeepSeek",
    description: "基础版本",
  },
  {
    id: "deepseek/deepseek-chat-v3-0324:free",
    name: "DeepSeek Chat V3",
    provider: "DeepSeek",
    description: "对话优化版本",
  },
  {
    id: "google/gemini-2.0-flash-exp:free",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    description: "快速响应模型",
  },
]

interface ModelSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const [open, setOpen] = React.useState(false)

  // 查找当前选中的模型
  const selectedModel = models.find((model) => model.id === value) || models[0]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          <div className="flex items-center text-left">
            <div className="mr-2 h-2 w-2 rounded-full bg-blue-500" />
            <div>
              <div className="font-medium">{selectedModel.name}</div>
              <div className="text-xs text-muted-foreground">{selectedModel.provider}</div>
            </div>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="搜索模型..." />
          <CommandList>
            <CommandEmpty>未找到模型</CommandEmpty>
            <CommandGroup>
              {models.map((model) => (
                <CommandItem
                  key={model.id}
                  value={model.id}
                  onSelect={() => {
                    onChange(model.id)
                    setOpen(false)
                  }}
                >
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-blue-500" />
                    <div>
                      <div className="font-medium">{model.name}</div>
                      <div className="text-xs text-muted-foreground">{model.provider}</div>
                    </div>
                  </div>
                  <Check className={cn("ml-auto h-4 w-4", value === model.id ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
