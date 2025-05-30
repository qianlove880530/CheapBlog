"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ChevronRight, X, Loader2, AlertCircle } from "lucide-react"
import { useAI } from "@/components/ai/ai-provider"
import { useSearchParams } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLanguage } from "@/components/i18n/language-provider"

export default function AiSummary() {
  const [summary, setSummary] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentContentId, setCurrentContentId] = useState<string | null>(null)
  const { generateAIResponse, error: aiError } = useAI()
  const searchParams = useSearchParams()
  const contentId = searchParams.get("content")
  const summaryRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const { language } = useLanguage()

  // 翻译函数
  const t = (zh: string, en: string) => (language === "zh" ? zh : en)

  // 当contentId或language变化时，重置总结
  useEffect(() => {
    if (contentId !== currentContentId) {
      setSummary(null)
      setIsExpanded(false)
      setCurrentContentId(contentId)
    }
  }, [contentId, currentContentId, language])

  // 获取当前显示的内容
  const getCurrentContent = async (): Promise<string> => {
    try {
      // 等待一小段时间，确保内容已加载
      await new Promise((resolve) => setTimeout(resolve, 500))

      // 尝试获取带有data-ai-content属性的元素
      const contentElements = document.querySelectorAll('[data-ai-content="true"]')
      if (contentElements.length > 0) {
        // 找到最长的内容
        let bestElement = contentElements[0]
        let maxLength = bestElement.textContent?.length || 0

        contentElements.forEach((el) => {
          const length = el.textContent?.length || 0
          if (length > maxLength) {
            maxLength = length
            bestElement = el
          }
        })

        const content = bestElement.textContent || ""
        if (content.length > 200) {
          return content
        }
      }

      // 尝试获取.prose类的元素
      const proseElements = document.querySelectorAll(".prose")
      if (proseElements.length > 0) {
        const content = proseElements[0].textContent || ""
        if (content.length > 200) {
          return content
        }
      }

      // 尝试获取内容容器
      const contentContainer = document.querySelector('[data-content-container="true"]')
      if (contentContainer) {
        const content = contentContainer.textContent || ""
        if (content.length > 200) {
          return content
        }
      }

      // 如果以上方法都失败，使用默认内容
      return language === "zh"
        ? `
# 人工智能：未来的必备技能

人工智能（AI）正在迅速改变我们的世界。从智能手机上的语音助手到自动驾驶汽车，从医疗诊断到金融分析，AI技术正在各个领域发挥越来越重要的作用。学习AI不仅可以帮助我们理解这些技术是如何工作的，还能让我们在这个快速变化的世界中保持竞争力。

## AI的广泛应用

AI技术已经渗透到我们生活的方方面面：

- 医疗保健：AI可以帮助医生更准确地诊断疾病，预测患者风险，并开发个性化治疗方案。
- 金融：AI算法可以检测欺诈行为，优化投资组合，并提供个性化的财务建议。
- 教育：AI可以创建个性化学习体验，帮助学生根据自己的节奏和学习风格学习。
- 交通：自动驾驶技术正在改变我们的出行方式，提高道路安全性。

## 职业发展机会

随着AI技术的普及，对AI专业人才的需求也在急剧增长。学习AI可以为你打开许多职业发展的大门：

1. 机器学习工程师
2. 数据科学家
3. AI研究员
4. 自然语言处理专家
5. 计算机视觉工程师

这些职位不仅薪资丰厚，而且工作内容充满挑战和创新。
`
        : `
# Artificial Intelligence: An Essential Skill for the Future

Artificial Intelligence (AI) is rapidly changing our world. From voice assistants on smartphones to self-driving cars, from medical diagnostics to financial analysis, AI technology is playing an increasingly important role in various fields. Learning AI not only helps us understand how these technologies work but also allows us to stay competitive in this fast-changing world.

## Widespread Applications of AI

AI technology has already permeated many aspects of our lives:

- Healthcare: AI can help doctors diagnose diseases more accurately, predict patient risks, and develop personalized treatment plans.
- Finance: AI algorithms can detect fraudulent activities, optimize investment portfolios, and provide personalized financial advice.
- Education: AI can create personalized learning experiences, helping students learn at their own pace and according to their learning styles.
- Transportation: Self-driving technology is changing how we travel and improving road safety.

## Career Development Opportunities

With the proliferation of AI technology, the demand for AI professionals is growing rapidly. Learning AI can open many doors for your career development:

1. Machine Learning Engineer
2. Data Scientist
3. AI Researcher
4. Natural Language Processing Specialist
5. Computer Vision Engineer

These positions not only offer generous compensation but also provide work that is full of challenges and innovation.
`
    } catch (e) {
      console.error(t("获取内容错误:", "Error getting content:"), e)
      return t("无法获取页面内容。", "Unable to get page content.")
    }
  }

  // 清理AI响应中的标签内容
  const cleanResponse = (text: string): string => {
    // 移除所有<Thinking>...</Thinking>标签及其内容
    const cleanedText = text
      .replace(/<Thinking>[\s\S]*?<\/Thinking>/gi, "")
      // 移除所有<Thinking>...</Thinking>标签及其内容
      .replace(/<Thinking>[\s\S]*?<\/think>/gi, "")
      // 移除所有<Thinking>...</Thinking>标签及其内容
      .replace(/<Thinking>[\s\S]*?<\/thinking>/gi, "")
      // 移除任何其他可能的思考标签
      .replace(/<Think>[\s\S]*?<\/Think>/gi, "")

    return cleanedText
  }

  const generateSummary = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const content = await getCurrentContent()

      // 检查内容长度
      if (!content || content.length < 200) {
        throw new Error(
          t(
            `无法获取足够的内容进行总结 (获取到 ${content.length} 字符)`,
            `Unable to get enough content for summary (got ${content.length} characters)`,
          ),
        )
      }

      const systemPrompt =
        language === "zh"
          ? `
你是一名内容洞察分析专家 + 职业发展顾问，善于将复杂网页或文档内容提炼成具有方向性、启发性与应用指导意义的中文总结。

# 用户目标：
用户正在浏览一段网页内容，希望快速理解该内容的核心价值、学习意义、职业发展方向，以及可以做的 AI 项目或应用。

# 请执行以下任务：
阅读输入的网页内容，输出一段结构化的总结，使用简洁优雅的中文表达，使用 Markdown 格式，并严格按照以下七个结构输出：

---
### 📘 内容总结报告

**1. 核心内容简述：**  
（用一句话概括页面的主旨）

**2. 知识的学习价值：**  
（说明这个内容为什么重要，对个人/行业有什么价值）

**3. 学习后的能力提升：**  
（学完可以掌握哪些技能或思维方式）

**4. 相关就业方向：**  
（具体列举3个相关职业或行业）

**5. 应用落地场景：**  
（举例说明在哪些现实问题中可应用此知识）

**6. 可开发的 AI / App 项目构想：**  
（结合当前趋势，列出1~2个可落地的产品或功能）

**7. 适合的人群与建议路径：**  
（适合哪些人学？初学者如何入门？进阶者如何拓展？）
---

# 输出要求：
- Markdown 格式
- 风格清晰、逻辑性强、对初学者友好，避免晦涩术语
- 只总结与分析，不照搬原文句子
- 不输出任何额外解释或说明

# 示例输入：
Python 是一种功能强大且用途广泛的编程语言，适用于数据分析、人工智能、Web 开发等多个领域。它拥有大量的开源库和简洁的语法，是许多程序员的首选语言。

# 示例输出：
### 📘 内容总结报告

**1. 核心内容简述：**  
Python 是功能全面、适用于多场景的主流编程语言。

**2. 知识的学习价值：**  
作为 AI 与数据分析的首选语言，Python 是现代技术人才的必备技能之一。

**3. 学习后的能力提升：**  
掌握自动化编程、数据处理、网站开发等核心能力。

**4. 相关就业方向：**  
数据分析师、AI 工程师、后端开发工程师。

**5. 应用落地场景：**  
数据可视化、智能客服、脚本自动化、爬虫系统等。

**6. 可开发的 AI / App 项目构想：**  
自动问答机器人、数据处理平台、PDF 解析工具。

**7. 适合的人群与建议路径：**  
零基础学习者可从语法和实战项目入手，有开发经验者建议结合 Pandas、Flask 深入学习。

请不要在回复中包含任何<Thinking>、</Thinking>、<Think>、</Think>、<Thinking>或</Thinking>标签。
`
          : `
You are a content insight analyst and career development advisor who excels at distilling complex web or document content into English summaries with directional, inspirational, and practical guidance.

# User Goal:
The user is browsing web content and wants to quickly understand its core value, learning significance, career development directions, and potential AI projects or applications.

# Please perform the following tasks:
Read the input web content and output a structured summary using concise and elegant English expression. Use Markdown format and strictly follow these seven structures:

---
### 📘 Content Summary Report

**1. Core Content Overview:**  
(Summarize the main theme in one sentence)

**2. Learning Value:**  
(Explain why this content is important and its value to individuals/industries)

**3. Skills Enhancement:**  
(What skills or thinking methods can be mastered after learning)

**4. Related Career Paths:**  
(List 3 specific related professions or industries)

**5. Practical Application Scenarios:**  
(Provide examples of real-world problems where this knowledge can be applied)

**6. Potential AI/App Project Ideas:**  
(List 1-2 feasible products or features based on current trends)

**7. Target Audience & Suggested Learning Path:**  
(Who should learn this? How should beginners start? How can advanced learners expand?)
---

# Output Requirements:
- Markdown format
- Clear style, strong logic, beginner-friendly, avoid obscure terminology
- Only summarize and analyze, do not copy sentences from the original text
- Do not output any additional explanations or comments

# Example Input:
Python is a powerful and versatile programming language suitable for data analysis, artificial intelligence, web development, and many other fields. It has a large number of open-source libraries and concise syntax, making it the preferred language for many programmers.

# Example Output:
### 📘 Content Summary Report

**1. Core Content Overview:**  
Python is a comprehensive, multi-purpose mainstream programming language.

**2. Learning Value:**  
As the preferred language for AI and data analysis, Python is an essential skill for modern tech professionals.

**3. Skills Enhancement:**  
Master core capabilities in automated programming, data processing, and website development.

**4. Related Career Paths:**  
Data Analyst, AI Engineer, Backend Developer.

**5. Practical Application Scenarios:**  
Data visualization, intelligent customer service, script automation, web scraping systems, etc.

**6. Potential AI/App Project Ideas:**  
Automated Q&A chatbot, data processing platform, PDF parsing tool.

**7. Target Audience & Suggested Learning Path:**  
Beginners can start with syntax and practical projects; experienced developers should explore deeper with Pandas and Flask.

Please do not include any <Thinking>, </Thinking>, <Think>, </Think>, <Thinking>, or </Thinking> tags in your response.
`

      const response = await generateAIResponse({
        prompt: content,
        systemPrompt,
        temperature: 0.7,
        maxTokens: 1000,
      })

      // 清理响应中的标签内容
      const cleanedResponse = cleanResponse(response)
      setSummary(cleanedResponse)
    } catch (error: any) {
      console.error(t("生成总结时出错:", "Error generating summary:"), error)
      setError(error.message || t("生成总结时出错，请稍后再试", "Error generating summary, please try again later"))
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <>
      <Card className="rounded-xl shadow-md">
        <CardHeader className="pb-3 bg-gradient-to-r from-amber-100 to-teal-100">
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <Sparkles size={18} className="text-amber-500" />
            {t("AI 总结助手", "AI Summary Assistant")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <p className="text-sm text-muted-foreground mb-3">
            {t(
              "点击下方按钮，AI将为您总结当前页面的主要内容。",
              "Click the button below, AI will summarize the main content of the current page for you.",
            )}
          </p>

          {error && (
            <Alert variant="destructive" className="mb-3">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {aiError && !error && (
            <Alert variant="warning" className="mb-3">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{aiError}</AlertDescription>
            </Alert>
          )}

          {summary ? (
            <div className="p-3 bg-gradient-to-r from-amber-50 to-teal-50 rounded-lg text-sm">
              <p className="text-amber-800 font-medium">{t("总结已生成", "Summary Generated")}</p>
              <div className="flex justify-between items-center mt-2">
                <Button variant="link" size="sm" className="p-0 h-auto text-teal-600" onClick={() => setSummary(null)}>
                  {t("重新生成", "Regenerate")}
                </Button>
                <Button variant="outline" size="sm" className="rounded-full h-8 w-8 p-0" onClick={toggleExpanded}>
                  <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full rounded-lg border-amber-200 bg-gradient-to-r from-amber-50 to-teal-50 hover:from-amber-100 hover:to-teal-100 hover:text-amber-700 text-amber-900"
              onClick={generateSummary}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("生成中...", "Generating...")}
                </>
              ) : (
                t("一键总结", "One-Click Summary")
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* 弹出的总结内容 */}
      <div
        ref={summaryRef}
        className={`fixed top-0 right-0 h-full w-96 bg-gradient-to-b from-sky-100 to-sky-50 dark:from-sky-900 dark:to-sky-800 shadow-lg transform transition-transform duration-300 z-50 overflow-y-auto ${
          isExpanded ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-teal-600 bg-clip-text text-transparent">
              {t("AI 内容总结", "AI Content Summary")}
            </h3>
            <Button variant="ghost" size="icon" onClick={toggleExpanded} className="rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            {summary ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground">{t("正在加载总结内容...", "Loading summary content...")}</p>
            )}
          </div>
        </div>
      </div>

      {/* 遮罩层，仅在展开时显示 */}
      {isExpanded && <div className="fixed inset-0 bg-black/20 z-40" onClick={toggleExpanded} aria-hidden="true" />}
    </>
  )
}
