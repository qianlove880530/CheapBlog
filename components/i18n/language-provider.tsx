"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// 定义语言类型
type Language = "zh" | "en"

// 定义翻译内容
const translations = {
  zh: {
    language: "zh",
    nav: {
      home: "首页",
      blog: "博客",
      aiChat: "AI聊天",
      aiTools: "AI工具导航",
    },
    // 其他翻译...
  },
  en: {
    language: "en",
    nav: {
      home: "Home",
      blog: "Blog",
      aiChat: "AI Chat",
      aiTools: "AI Tools",
    },
    // 其他翻译...
  },
}

// 创建语言上下文
const LanguageContext = createContext<{
  language: Language
  t: (key: string) => string
  setLanguage: (lang: Language) => void
}>({
  language: "en",
  t: () => "",
  setLanguage: () => {},
})

// 语言提供者组件
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  // 从本地存储加载语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "zh" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    }
  }, [])

  // 保存语言设置到本地存储
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  // 翻译函数
  const t = (key: string) => {
    const keys = key.split(".")
    let value: any = translations[language]

    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k]
      } else {
        return key
      }
    }

    return value
  }

  return <LanguageContext.Provider value={{ language, t, setLanguage }}>{children}</LanguageContext.Provider>
}

// 使用语言的钩子
export const useLanguage = () => useContext(LanguageContext)
