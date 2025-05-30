"use client"

import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { useLanguage } from "./language-provider"

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "zh" ? "en" : "zh")
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <Globe className="h-4 w-4" />
      <span>{t("language.switch")}</span>
    </Button>
  )
}
