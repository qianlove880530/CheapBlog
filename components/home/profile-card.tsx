"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Briefcase } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "../i18n/language-provider"

export default function ProfileCard() {
  const { language } = useLanguage()

  const content = {
    title: {
      zh: "王贤瑞 Ray",
      en: "Ray Wang",
    },
    position: {
      zh: "高级BA | AI应用专家 | 技术分享者",
      en: "Senior BA | AI Application Expert | Tech Sharer",
    },
    certifications: {
      title: {
        zh: "专业认证",
        en: "Professional Certifications",
      },
      items: [
        {
          zh: "IBM IT Scrum Master",
          en: "IBM IT Scrum Master",
        },
        {
          zh: "IBM Generative AI For Data Science",
          en: "IBM Generative AI For Data Science",
        },
        {
          zh: "Google UX Designer",
          en: "Google UX Designer",
        },
        {
          zh: "Qualified AI Agent Developer",
          en: "Qualified AI Agent Developer",
        },
        {
          zh: "Google Analytics",
          en: "Google Analytics",
        },
        {
          zh: "AI for All: From Basics to GenAI Practice",
          en: "AI for All: From Basics to GenAI Practice",
        },
      ],
    },
    expertise: {
      title: {
        zh: "专业领域",
        en: "Areas of Expertise",
      },
      items: [
        {
          zh: "商业分析",
          en: "Business Analyst",
        },
        {
          zh: "AI应用落地",
          en: "AI Application Implementation",
        },
        {
          zh: "产品设计",
          en: "Product Design",
        },
        {
          zh: "零代码开发",
          en: "No-Code Development",
        },
        {
          zh: "SaaS服务",
          en: "SaaS Service",
        },
        {
          zh: "AI数据分析",
          en: "Data With AI",
        },
      ],
    },
    bio: [
      {
        zh: "我是一名无代码产品经理兼业务分析师，热衷于分享并将前沿的AI技术应用于真实的商业场景。我专注于打造用户友好、可扩展且符合合规要求的解决方案，致力于在复杂系统与实际用户需求之间架起桥梁。",
        en: "I’m a no-code product manager and business analyst passionate about sharing and applying cutting-edge AI technologies to real-world business scenarios. My focus is on creating user-friendly, scalable, and compliant solutions that bridge the gap between complex systems and real user needs.",
      },
      {
        zh: "在我的工作中，我致力于通过零代码工具与 AI 自动化技术，降低产品开发门槛，让更多非技术背景的团队也能高效落地 AI 应用。无论是构建智能客服、自动化工作流，还是个性化推荐系统，我都乐于将复杂的技术抽象为简单可用的产品功能。",
        en: "In my work, I am committed to lowering the barriers to product development through no-code tools and AI automation technologies, enabling more teams without technical backgrounds to efficiently implement AI applications. Whether building intelligent customer service, automated workflows, or personalized recommendation systems, I enjoy abstracting complex technologies into simple, usable product features.",
      },
      {
        zh: "我持续探索包括 LLM（大语言模型）、RAG 知识库、AI 流程自动化等领域的应用方式，擅长将概念变成可交付的产品，通过实战积累经验，并乐于将我的经验通过博客、演示与开源项目分享给更多同样热爱 AI 的朋友。",
        en: "I continuously explore application methods in areas including LLMs (Large Language Models), RAG knowledge bases, AI process automation, etc., excelling at turning concepts into deliverable products, accumulating experience through practice, and enjoying sharing my experiences through blogs, demonstrations, and open-source projects with more friends who also love AI.",
      },
      {
        zh: "欢迎和我一起用 AI 做出真正有价值的产品，用工具赋能创意，用技术驱动改变。",
        en: "Welcome to join me in creating truly valuable products with AI, empowering creativity with tools, and driving change with technology.",
      },
    ],
    qrCode: {
      zh: "微信扫码加好友",
      en: "Scan WeChat QR code to add friend",
    },
  }

  return (
    <Card className="rounded-xl overflow-hidden shadow-lg">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-40" />
        <div className="px-6 pb-6 pt-0 -mt-20">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 左侧：头像和二维码 */}
            <div className="flex flex-col items-center lg:w-1/4">
              {/* 竖向长方形头像 */}
              <div className="relative w-40 h-56 overflow-hidden rounded-xl border-4 border-background shadow-lg">
                <Image
                  src="/images/new-profile-avatar.jpg"
                  alt="Profile"
                  fill
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                  className="hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <a
                  href="mailto:raywang0804@gmail.com"
                  className="rounded-full p-2 bg-background border hover:bg-purple-50 transition-colors"
                  aria-label="Email"
                  title="Email: raywang0804@gmail.com"
                >
                  <Mail size={20} />
                </a>
                <a
                  href="https://www.linkedin.com/in/ray-wang-a148a5294/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full p-2 bg-background border hover:bg-purple-50 transition-colors"
                  aria-label="LinkedIn"
                  title="LinkedIn: Ray Wang"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                <a
                  href="https://t.me/RUIWORM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full p-2 bg-background border hover:bg-purple-50 transition-colors"
                  aria-label="Telegram"
                  title="Telegram: @RUIWORM"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21.5 4.5L2.5 12.5L9.5 13.5L11.5 19.5L14.5 15.5L18.5 18.5L21.5 4.5Z"></path>
                    <path d="M9.5 13.5L18.5 8.5"></path>
                  </svg>
                </a>
              </div>

              <div className="mt-6 bg-white p-2 rounded-xl shadow-md">
                <Image
                  src="/images/wechat-qrcode.png"
                  alt="WeChat QR Code"
                  width={150}
                  height={150}
                  className="rounded-lg"
                />
              </div>
              <p className="mt-2 text-sm text-center text-muted-foreground">{content.qrCode[language]}</p>
            </div>

            {/* 右侧：个人信息和介绍 */}
            <div className="flex-1 mt-4 lg:mt-0">
              <h2 className="text-3xl font-bold">{content.title[language]}</h2>

              <div className="flex items-center mt-2 text-white font-medium">
                <Briefcase className="mr-2 h-4 w-4" />
                <p>{content.position[language]}</p>
              </div>

              <div className="mt-4 space-y-2">
                <div className="font-medium text-lg">{content.certifications.title[language]}</div>
                <div className="flex flex-wrap gap-2">
                  {content.certifications.items.map((cert, index) => (
                    <Badge
                      key={index}
                      className="rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300"
                    >
                      {cert[language]}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="font-medium text-lg">{content.expertise.title[language]}</div>
                <div className="flex flex-wrap gap-2">
                  {content.expertise.items.map((expertise, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="rounded-full bg-pink-100 text-pink-800 hover:bg-pink-200 border-pink-300"
                    >
                      {expertise[language]}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-4 text-muted-foreground">
                {content.bio.map((paragraph, index) => (
                  <p key={index} className={index === content.bio.length - 1 ? "font-medium text-foreground" : ""}>
                    {paragraph[language]}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
