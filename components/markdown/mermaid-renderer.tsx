"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguage } from "@/components/i18n/language-provider"
import { useTheme } from "next-themes"

interface MermaidProps {
  chart: string
  title?: string
}

export default function MermaidRenderer({ chart, title }: MermaidProps) {
  const { resolvedTheme } = useTheme()
  const { language } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [key, setKey] = useState(0) // 用于强制重新渲染

  // 翻译函数
  const t = (zh: string, en: string) => (language === "en" ? en : zh)

  useEffect(() => {
    // 确保只在客户端执行
    if (typeof window === "undefined") return

    // 导入 mermaid (动态导入避免SSR问题)
    const renderMermaid = async () => {
      try {
        setLoading(true)
        setError(null)

        // 动态导入 mermaid
        const mermaid = (await import("mermaid")).default

        // 配置 mermaid
        mermaid.initialize({
          startOnLoad: false,
          theme: resolvedTheme === "dark" ? "dark" : "default",
          securityLevel: "loose",
          fontFamily: "inherit",
        })

        // 确保DOM元素存在
        if (!ref.current) {
          setError(t("渲染容器不存在", "Rendering container not found"))
          setLoading(false)
          return
        }

        // 生成唯一ID
        const id = `mermaid-${Date.now()}-${Math.floor(Math.random() * 10000)}`

        try {
          // 清空容器
          ref.current.innerHTML = ""

          // 渲染图表
          const { svg } = await mermaid.render(id, chart)

          // 再次检查DOM元素是否存在
          if (ref.current) {
            ref.current.innerHTML = svg
          }
        } catch (renderError) {
          console.error("Mermaid渲染错误:", renderError)
          setError(t("图表语法错误", "Chart syntax error"))

          // 尝试显示错误信息
          if (ref.current) {
            ref.current.innerHTML = `<div class="text-red-500 p-2">${t("图表语法错误", "Chart syntax error")}</div>`
          }
        }
      } catch (importError) {
        console.error("Mermaid导入错误:", importError)
        setError(t("无法加载图表库", "Failed to load chart library"))
      } finally {
        setLoading(false)
      }
    }

    // 执行渲染
    renderMermaid()

    // 当组件卸载时，清理DOM
    return () => {
      if (ref.current) {
        ref.current.innerHTML = ""
      }
    }
  }, [chart, resolvedTheme, language, key])

  // 添加重试功能
  const handleRetry = () => {
    setKey((prev) => prev + 1) // 强制重新渲染
  }

  return (
    <Card className="my-6 overflow-hidden">
      {title && (
        <div className="bg-muted/50 px-4 py-2 border-b">
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
      )}
      <div className="p-4">
        {loading && <Skeleton className="h-40 w-full" />}
        {error && (
          <div className="text-red-500 p-4 text-center">
            <p>{error}</p>
            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-40">{chart}</pre>
            <button
              onClick={handleRetry}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              {t("重试", "Retry")}
            </button>
          </div>
        )}
        <div ref={ref} className="mermaid-container flex justify-center" style={{ minHeight: loading ? 0 : "auto" }} />
      </div>
    </Card>
  )
}
