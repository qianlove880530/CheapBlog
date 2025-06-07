"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, X, ChevronRight, BookOpen, MessageSquare, Sparkles, BarChart } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/components/i18n/language-provider"
import { cn } from "@/lib/utils"

interface ProductProps {
  title: {
    zh: string
    en: string
  }
  description: {
    zh: string
    en: string
  }
  logo: string
  url: string
  features: {
    zh: string
    en: string
  }[]
  badgeText: {
    zh: string
    en: string
  }
  badgeColor: string
  icon: React.ReactNode
  imageUrl: string
}

export default function ProductShowcase() {
  const { language, t } = useLanguage()
  const [activeProduct, setActiveProduct] = useState<number | null>(null)
  const circleRefs = useRef<(HTMLButtonElement | null)[]>([])

  // 关闭详情面板的处理函数
  const handleClickOutside = (event: MouseEvent) => {
    if (activeProduct !== null) {
      const activeCircle = circleRefs.current[activeProduct]
      const detailsElement = document.getElementById(`product-details-${activeProduct}`)

      if (
        activeCircle &&
        detailsElement &&
        !activeCircle.contains(event.target as Node) &&
        !detailsElement.contains(event.target as Node)
      ) {
        setActiveProduct(null)
      }
    }
  }

  // 添加和移除点击外部关闭的事件监听器
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeProduct])

  const products = [
    {
      title: {
        zh: "StudyWithAI",
        en: "StudyWithAI",
      },
      description: {
        zh: "AI驱动的个性化学习平台，生成定制学习内容",
        en: "AI-driven personalized learning platform generating customized content",
      },
      logo: "/abstract-s.png",
      url: "https://www.studywithai.info",
      features: [
        {
          zh: "AI生成个性化学习路径",
          en: "AI-generated personalized learning paths",
        },
        {
          zh: "智能内容推荐和适应性学习",
          en: "Smart content recommendations and adaptive learning",
        },
        {
          zh: "多种学科和技能的学习资源",
          en: "Learning resources for various subjects and skills",
        },
        {
          zh: "实时学习进度跟踪和分析",
          en: "Real-time learning progress tracking and analysis",
        },
      ],
      badgeText: {
        zh: "教育科技",
        en: "EdTech",
      },
      badgeColor: "bg-gradient-to-r from-purple-600 to-pink-600",
      icon: <BookOpen className="text-white" size={20} />,
      imageUrl: "/ai-learning-dashboard.png",
    },
    {
      title: {
        zh: "PeppoAI",
        en: "PeppoAI",
      },
      description: {
        zh: "企业级AI知识库客服平台，提升客户服务效率",
        en: "Enterprise AI knowledge base customer service platform",
      },
      logo: "/abstract-b-flow.png",
      url: "https://aipeppo.tech",
      features: [
        {
          zh: "AI驱动的智能客服系统",
          en: "AI-powered intelligent customer service system",
        },
        {
          zh: "企业知识库集成和管理",
          en: "Enterprise knowledge base integration and management",
        },
        {
          zh: "多渠道客户支持",
          en: "Multi-channel customer support",
        },
        {
          zh: "数据分析和客服绩效监控",
          en: "Data analysis and service performance monitoring",
        },
      ],
      badgeText: {
        zh: "企业服务",
        en: "Enterprise",
      },
      badgeColor: "bg-gradient-to-r from-purple-600 to-pink-600",
      icon: <MessageSquare className="text-white" size={20} />,
      imageUrl: "/ai-customer-service-dashboard.png",
    },
    {
      title: {
        zh: "PromptHub",
        en: "PromptHub",
      },
      description: {
        zh: "工程型提示词AI站点，生成优质Prompt",
        en: "Engineering-focused AI prompt site, generating high-quality prompts",
      },
      logo: "/abstract-p-minimal.png",
      url: "https://v0-prompt-subscription-site-eieupk.vercel.app/",
      features: [
        {
          zh: "专业提示词生成和优化",
          en: "Professional prompt generation and optimization",
        },
        {
          zh: "多种AI模型的提示词库",
          en: "Prompt library for various AI models",
        },
        {
          zh: "提示词分享和社区协作",
          en: "Prompt sharing and community collaboration",
        },
        {
          zh: "提示词效果评估和改进建议",
          en: "Prompt effectiveness evaluation and improvement suggestions",
        },
      ],
      badgeText: {
        zh: "AI工具",
        en: "AI Tools",
      },
      badgeColor: "bg-gradient-to-r from-purple-600 to-pink-600",
      icon: <Sparkles className="text-white" size={20} />,
      imageUrl: "/prompt-engineer-ide.png",
    },
    {
      title: {
        zh: "ATP Trades",
        en: "ATP Trades",
      },
      description: {
        zh: "AI+传统技术驱动的区块链交易承兑平台",
        en: "AI + traditional tech-driven blockchain trading platform",
      },
      logo: "/abstract-geometric-logo.png",
      url: "https://www.atptrades.com",
      features: [
        {
          zh: "智能交易匹配和风险评估",
          en: "Intelligent trade matching and risk assessment",
        },
        {
          zh: "区块链安全交易和承兑",
          en: "Blockchain secure transactions and acceptance",
        },
        {
          zh: "多币种支持和汇率优化",
          en: "Multi-currency support and exchange rate optimization",
        },
        {
          zh: "交易数据分析和趋势预测",
          en: "Transaction data analysis and trend prediction",
        },
      ],
      badgeText: {
        zh: "金融科技",
        en: "FinTech",
      },
      badgeColor: "bg-gradient-to-r from-purple-600 to-pink-600",
      icon: <BarChart className="text-white" size={20} />,
      imageUrl: "/blockchain-trading-dashboard.png",
    },
  ]

  const toggleProduct = (index: number) => {
    setActiveProduct(activeProduct === index ? null : index)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {language === "zh" ? "我的产品展示" : "My Products"}
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-6 md:gap-8">
        {products.map((product, index) => (
          <div key={index} className="relative">
            {/* 圆形项目按钮 */}
            <button
              ref={(el) => (circleRefs.current[index] = el)}
              onClick={() => toggleProduct(index)}
              className={cn(
                "w-24 h-24 md:w-28 md:h-28 rounded-full flex flex-col items-center justify-center p-2 transition-all duration-300",
                "bg-white dark:bg-gray-900",
                "border hover:border-purple-400 dark:hover:border-purple-500 shadow-md hover:shadow-lg",
                activeProduct === index
                  ? "border-purple-500 dark:border-purple-400 ring-2 ring-purple-300 dark:ring-purple-600 ring-opacity-50"
                  : "border-gray-200 dark:border-gray-700",
              )}
              aria-expanded={activeProduct === index}
              aria-controls={`product-details-${index}`}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mb-1">
                {product.icon}
              </div>
              <span className="text-xs md:text-sm font-medium text-center line-clamp-2">{product.title[language]}</span>
            </button>

            {/* 展开的详情面板 */}
            <div
              id={`product-details-${index}`}
              className={cn(
                "absolute z-10 transition-all duration-300 overflow-hidden bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-purple-200 dark:border-purple-900",
                "w-0 h-0 opacity-0 invisible",
                activeProduct === index && "w-[280px] sm:w-[320px] md:w-[400px] h-auto opacity-100 visible",
              )}
              style={{
                top: "50%",
                left: "100%",
                transform: activeProduct === index ? "translateY(-50%)" : "translateY(-50%) translateX(-20px)",
                transformOrigin: "left center",
                marginLeft: "12px",
              }}
            >
              {activeProduct === index && (
                <Card className="w-full border-0 shadow-none">
                  <div className="relative">
                    <div className="h-24 md:h-32 w-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"></div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-white hover:bg-white/20 z-10"
                        onClick={() => setActiveProduct(null)}
                        aria-label="Close details"
                      >
                        <X size={18} />
                      </Button>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center mr-3 shadow-md">
                          <Image
                            src={product.logo || "/placeholder.svg"}
                            alt={`${product.title[language]} logo`}
                            width={24}
                            height={24}
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{product.title[language]}</h3>
                          <Badge className="mt-1 bg-white/20 text-white border-none">
                            {product.badgeText[language]}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{product.description[language]}</p>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">{t("home.products.features")}</h4>
                      <ul className="space-y-1">
                        {product.features.map((feature, idx) => (
                          <li key={idx} className="text-sm flex items-start">
                            <ChevronRight className="text-purple-500 dark:text-purple-400 mr-1 h-4 w-4 flex-shrink-0 mt-0.5" />
                            <span>{feature[language]}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                      onClick={() => window.open(product.url, "_blank")}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {t("Explore")}
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
