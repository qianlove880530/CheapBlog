"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Cpu, BarChart, Zap } from "lucide-react"
import { useLanguage } from "@/components/i18n/language-provider"

export default function ProjectIntro() {
  const { language } = useLanguage()

  const content = {
    title: {
      zh: "AI Matrix 项目",
      en: "AI Matrix Project",
    },
    subtitle: {
      zh: "我们正在构建的前沿AI技术",
      en: "Cutting-edge AI technologies we're building",
    },
    cards: [
      {
        title: {
          zh: "智能对话系统",
          en: "Intelligent Dialogue System",
        },
        description: {
          zh: "基于大型语言模型的新一代对话系统",
          en: "Next-generation dialogue system based on large language models",
        },
        content: {
          zh: "我们的智能对话系统采用最先进的大型语言模型技术，能够理解复杂的语境，提供准确、有用的回答。系统支持多轮对话，记忆上下文，并且可以根据用户需求进行个性化定制。",
          en: "Our intelligent dialogue system uses state-of-the-art large language model technology to understand complex contexts and provide accurate, useful answers. The system supports multi-turn conversations, remembers context, and can be personalized according to user needs.",
        },
        badge: {
          zh: "核心技术",
          en: "Core Technology",
        },
        icon: <Brain className="text-pink-500" size={24} />,
        badgeClass: "bg-pink-500 hover:bg-pink-600",
        borderClass: "border-pink-200",
      },
      {
        title: {
          zh: "多模态学习",
          en: "Multimodal Learning",
        },
        description: {
          zh: "融合文本、图像和音频的AI模型",
          en: "AI models integrating text, images, and audio",
        },
        content: {
          zh: "我们的多模态学习研究旨在开发能够同时处理文本、图像和音频数据的AI模型。这些模型可以理解不同模态之间的关系，从而在图像描述、视频分析和跨模态检索等任务中表现出色。",
          en: "Our multimodal learning research aims to develop AI models capable of processing text, image, and audio data simultaneously. These models can understand relationships between different modalities, excelling in tasks such as image description, video analysis, and cross-modal retrieval.",
        },
        badge: {
          zh: "研究方向",
          en: "Research Direction",
        },
        icon: <Cpu className="text-amber-500" size={24} />,
        badgeClass: "bg-amber-500 hover:bg-amber-600",
        borderClass: "border-amber-200",
      },
      {
        title: {
          zh: "智能数据分析",
          en: "Intelligent Data Analysis",
        },
        description: {
          zh: "AI驱动的数据分析和可视化平台",
          en: "AI-driven data analysis and visualization platform",
        },
        content: {
          zh: "我们的智能数据分析平台利用机器学习算法自动发现数据中的模式和趋势。平台提供直观的可视化界面，使用户能够轻松理解复杂数据，并基于数据做出明智的决策。",
          en: "Our intelligent data analysis platform uses machine learning algorithms to automatically discover patterns and trends in data. The platform provides an intuitive visualization interface, enabling users to easily understand complex data and make informed decisions based on the data.",
        },
        badge: {
          zh: "应用领域",
          en: "Application Area",
        },
        icon: <BarChart className="text-teal-500" size={24} />,
        badgeClass: "bg-teal-500 hover:bg-teal-600",
        borderClass: "border-teal-200",
      },
      {
        title: {
          zh: "AI赋能创新",
          en: "AI-Empowered Innovation",
        },
        description: {
          zh: "探索AI在各行业的创新应用",
          en: "Exploring innovative AI applications across industries",
        },
        content: {
          zh: "我们致力于探索AI技术在医疗、教育、金融等领域的创新应用。通过与行业专家合作，我们开发针对特定场景的AI解决方案，帮助企业提高效率，创造新的价值。",
          en: "We are committed to exploring innovative applications of AI technology in healthcare, education, finance, and other fields. By collaborating with industry experts, we develop AI solutions for specific scenarios, helping businesses improve efficiency and create new value.",
        },
        badge: {
          zh: "未来展望",
          en: "Future Outlook",
        },
        icon: <Zap className="text-amber-500" size={24} />,
        badgeClass: "bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600",
        borderClass: "border-pink-200",
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-amber-600 to-teal-600 bg-clip-text text-transparent">
          {content.title[language]}
        </h2>
        <p className="text-muted-foreground mt-2">{content.subtitle[language]}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {content.cards.map((card, index) => (
          <Card key={index} className={`rounded-xl shadow-md hover:shadow-xl transition-shadow ${card.borderClass}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge className={card.badgeClass}>{card.badge[language]}</Badge>
                {card.icon}
              </div>
              <CardTitle className="mt-2">{card.title[language]}</CardTitle>
              <CardDescription>{card.description[language]}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{card.content[language]}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
