"use client"

import Link from "next/link"
import { Home, BookOpen, Bot, Grid3X3 } from "lucide-react"
import ThemeSwitcher from "@/components/layout/theme-switcher"
import LanguageSwitcher from "@/components/i18n/language-switcher"
import { useLanguage } from "@/components/i18n/language-provider"

export default function Navbar() {
  const { t } = useLanguage()

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <nav className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-1 hover:text-pink-600 transition-colors">
                <Home size={18} />
                <span>{t("nav.home")}</span>
              </Link>

              <Link href="/blog" className="flex items-center space-x-1 hover:text-amber-600 transition-colors">
                <BookOpen size={18} />
                <span>{t("nav.blog")}</span>
              </Link>

              <Link
                href="/ai-chat"
                className="flex items-center space-x-1 hover:text-amber-500 hover:bg-amber-50 px-2 py-1 rounded-md transition-colors"
              >
                <Bot size={18} />
                <span>{t("nav.aiChat")}</span>
              </Link>

              <Link
                href="/ai-tools"
                className="flex items-center space-x-1 hover:text-purple-500 hover:bg-purple-50 px-2 py-1 rounded-md transition-colors"
              >
                <Grid3X3 size={18} />
                <span>{t("nav.aiTools")}</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-amber-500 flex items-center justify-center">
                <span className="text-white font-bold">AI</span>
              </div>
              <span className="font-bold text-xl">
                {t("language") === "zh" ? (
                  <span className="bg-gradient-to-r from-pink-600 to-amber-600 bg-clip-text text-transparent">
                    阿瑞讲<span className="text-purple-600">AI</span>
                  </span>
                ) : (
                  <span className="bg-gradient-to-r from-pink-600 to-amber-600 bg-clip-text text-transparent">
                    RayWith<span className="text-purple-600">AI</span>
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
