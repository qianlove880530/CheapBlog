import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm backdrop-blur-[2px] bg-opacity-90",
      className,
    )}
    data-ai-content={props.children ? "true" : undefined}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    // 检查是否在客户端环境
    const isClient = typeof window !== "undefined"
    // 获取当前语言
    const currentLang = isClient ? localStorage.getItem("language") || "zh" : "zh"

    // 根据语言调整 padding
    const paddingClass = currentLang === "en" ? "p-6 pt-0" : "p-6 pt-0"

    return (
      <div
        ref={ref}
        className={cn(
          paddingClass,
          "break-words overflow-hidden", // 添加文本换行和溢出处理
          className,
        )}
        data-language={currentLang}
        style={
          {
            // 确保内容不会挤压图标
            minWidth: 0,
            // 保持图标大小一致
            "--icon-size": "1.5rem", // 可以根据需要调整图标大小
          } as React.CSSProperties
        }
        {...props}
      />
    )
  },
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
