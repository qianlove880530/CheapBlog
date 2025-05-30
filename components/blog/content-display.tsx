"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { useSearchParams } from "next/navigation"
import type { Node } from "@/lib/supabase"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useLanguage } from "@/components/i18n/language-provider"
import MermaidRenderer from "@/components/markdown/mermaid-renderer"

export default function ContentDisplay() {
  const [content, setContent] = useState<Node | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const contentId = searchParams.get("content")
  const { language } = useLanguage()

  // 翻译函数
  const t = (zh: string, en: string) => (language === "en" ? en : zh)

  useEffect(() => {
    const fetchContent = async () => {
      if (!contentId) {
        // 如果没有指定内容ID，显示默认内容
        setContent({
          id: "default",
          parent_id: null,
          name: t("为什么要学习人工智能？", "Why Learn Artificial Intelligence?"),
          name_en: "Why Learn Artificial Intelligence?",
          type: "category3",
          content:
            language === "zh"
              ? `
# 人工智能：未来的必备技能

人工智能（AI）正在迅速改变我们的世界。从智能手机上的语音助手到自动驾驶汽车，从医疗诊断到金融分析，AI技术正在各个领域发挥越来越重要的作用。学习AI不仅可以帮助我们理解这些技术是如何工作的，还能让我们在这个快速变化的世界中保持竞争力。

## AI的广泛应用

AI技术已经渗透到我们生活的方方面面：

- 医疗保健：AI可以帮助医生更准确地诊断疾病，预测患者风险，并开发个性化治疗方案。
- 金融：AI算法可以检测欺诈行为，优化投资组合，并提供个性化的财务建议。
- 教育：AI可以创建个性化学习体验，帮助学生根据自己的节奏和学习风格学习。
- 交通：自动驾驶技术正在改变我们的出行方式，提高道路安全性。

## AI学习路径

\`\`\`mermaid
graph TD
    A[开始学习AI] --> B[掌握编程基础]
    B --> C[学习数学基础]
    C --> D[机器学习基础]
    D --> E1[深度学习]
    D --> E2[强化学习]
    D --> E3[自然语言处理]
    D --> E4[计算机视觉]
    E1 --> F[实践项目]
    E2 --> F
    E3 --> F
    E4 --> F
    F --> G[参与AI社区]
\`\`\`

## 职业发展机会

随着AI技术的普及，对AI专业人才的需求也在急剧增长。学习AI可以为你打开许多职业发展的大门：

1. 机器学习工程师
2. 数据科学家
3. AI研究员
4. 自然语言处理专家
5. 计算机视觉工程师

这些职位不仅薪资丰厚，而且工作内容充满挑战和创新。

## 解决复杂问题的能力

学习AI不仅仅是学习特定的技术或算法，更是培养一种解决复杂问题的思维方式。AI研究涉及数学、统计学、计算机科学和领域专业知识的结合，这种跨学科的学习可以帮助你从多个角度思考问题，找到创新的解决方案。

## 塑造未来的机会

AI技术正处于快速发展阶段，学习AI给了你参与塑造未来的机会。你可以开发新的应用，解决重要的社会问题，或者推动AI技术向更负责任、更公平的方向发展。

## 开始学习AI的步骤

如果你对学习AI感兴趣，可以从以下几个步骤开始：

1. 掌握基础知识：学习编程（如Python）、线性代数、微积分和统计学。
2. 了解机器学习基础：学习监督学习、无监督学习和强化学习的基本概念。
3. 深入学习特定领域：根据你的兴趣，深入学习自然语言处理、计算机视觉或其他AI子领域。
4. 实践项目：通过实际项目应用你学到的知识，建立个人作品集。
5. 参与社区：加入AI社区，参与开源项目，与其他AI爱好者交流。

## 结论

学习AI是一项投资，不仅可以为你的职业发展带来机会，还可以帮助你理解和参与塑造我们的未来。无论你是学生、专业人士还是对技术感兴趣的爱好者，现在都是开始学习AI的好时机。
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

## AI Learning Path

\`\`\`mermaid
graph TD
    A[Start Learning AI] --> B[Master Programming Basics]
    B --> C[Learn Math Fundamentals]
    C --> D[Machine Learning Basics]
    D --> E1[Deep Learning]
    D --> E2[Reinforcement Learning]
    D --> E3[Natural Language Processing]
    D --> E4[Computer Vision]
    E1 --> F[Practical Projects]
    E2 --> F
    E3 --> F
    E4 --> F
    F --> G[Join AI Communities]
\`\`\`

## Career Development Opportunities

With the proliferation of AI technology, the demand for AI professionals is growing rapidly. Learning AI can open many doors for your career development:

1. Machine Learning Engineer
2. Data Scientist
3. AI Researcher
4. Natural Language Processing Specialist
5. Computer Vision Engineer

These positions not only offer generous compensation but also provide work that is full of challenges and innovation.

## Ability to Solve Complex Problems

Learning AI is not just about learning specific technologies or algorithms; it's about cultivating a way of thinking that can solve complex problems. AI research involves a combination of mathematics, statistics, computer science, and domain expertise. This interdisciplinary learning can help you think about problems from multiple perspectives and find innovative solutions.

## Opportunity to Shape the Future

AI technology is in a stage of rapid development, and learning AI gives you the opportunity to participate in shaping the future. You can develop new applications, solve important social problems, or push AI technology towards a more responsible and equitable direction.

## Steps to Start Learning AI

If you're interested in learning AI, you can start with the following steps:

1. Master the basics: Learn programming (such as Python), linear algebra, calculus, and statistics.
2. Understand machine learning fundamentals: Learn the basic concepts of supervised learning, unsupervised learning, and reinforcement learning.
3. Delve into specific areas: Based on your interests, delve deeper into natural language processing, computer vision, or other AI subfields.
4. Practical projects: Apply what you've learned through practical projects and build a personal portfolio.
5. Join the community: Join AI communities, participate in open-source projects, and interact with other AI enthusiasts.

## Conclusion

Learning AI is an investment that not only brings opportunities for your career development but also helps you understand and participate in shaping our future. Whether you're a student, a professional, or a technology enthusiast, now is a good time to start learning AI.
`,
          content_en: `
# Artificial Intelligence: An Essential Skill for the Future

Artificial Intelligence (AI) is rapidly changing our world. From voice assistants on smartphones to self-driving cars, from medical diagnostics to financial analysis, AI technology is playing an increasingly important role in various fields. Learning AI not only helps us understand how these technologies work but also allows us to stay competitive in this fast-changing world.

## Widespread Applications of AI

AI technology has already permeated many aspects of our lives:

- Healthcare: AI can help doctors diagnose diseases more accurately, predict patient risks, and develop personalized treatment plans.
- Finance: AI algorithms can detect fraudulent activities, optimize investment portfolios, and provide personalized financial advice.
- Education: AI can create personalized learning experiences, helping students learn at their own pace and according to their learning styles.
- Transportation: Self-driving technology is changing how we travel and improving road safety.

## AI Learning Path

\`\`\`mermaid
graph TD
    A[Start Learning AI] --> B[Master Programming Basics]
    B --> C[Learn Math Fundamentals]
    C --> D[Machine Learning Basics]
    D --> E1[Deep Learning]
    D --> E2[Reinforcement Learning]
    D --> E3[Natural Language Processing]
    D --> E4[Computer Vision]
    E1 --> F[Practical Projects]
    E2 --> F
    E3 --> F
    E4 --> F
    F --> G[Join AI Communities]
\`\`\`

## Career Development Opportunities

With the proliferation of AI technology, the demand for AI professionals is growing rapidly. Learning AI can open many doors for your career development:

1. Machine Learning Engineer
2. Data Scientist
3. AI Researcher
4. Natural Language Processing Specialist
5. Computer Vision Engineer

These positions not only offer generous compensation but also provide work that is full of challenges and innovation.

## Ability to Solve Complex Problems

Learning AI is not just about learning specific technologies or algorithms; it's about cultivating a way of thinking that can solve complex problems. AI research involves a combination of mathematics, statistics, computer science, and domain expertise. This interdisciplinary learning can help you think about problems from multiple perspectives and find innovative solutions.

## Opportunity to Shape the Future

AI technology is in a stage of rapid development, and learning AI gives you the opportunity to participate in shaping the future. You can develop new applications, solve important social problems, or push AI technology towards a more responsible and equitable direction.

## Steps to Start Learning AI

If you're interested in learning AI, you can start with the following steps:

1. Master the basics: Learn programming (such as Python), linear algebra, calculus, and statistics.
2. Understand machine learning fundamentals: Learn the basic concepts of supervised learning, unsupervised learning, and reinforcement learning.
3. Delve into specific areas: Based on your interests, delve deeper into natural language processing, computer vision, or other AI subfields.
4. Practical projects: Apply what you've learned through practical projects and build a personal portfolio.
5. Join the community: Join AI communities, participate in open-source projects, and interact with other AI enthusiasts.

## Conclusion

Learning AI is an investment that not only brings opportunities for your career development but also helps you understand and participate in shaping our future. Whether you're a student, a professional, or a technology enthusiast, now is a good time to start learning AI.
`,
          created_at: new Date().toISOString(),
        })
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        // 添加语言参数到请求
        const lang = language === "en" ? "en" : "zh"
        const response = await fetch(`/api/nodes/${contentId}?lang=${lang}`)
        if (!response.ok) {
          throw new Error(t("获取内容失败", "Failed to fetch content"))
        }
        const data = await response.json()
        setContent(data)
      } catch (error) {
        setError(typeof error === "string" ? error : t("获取内容失败", "Failed to fetch content"))
        console.error(t("获取内容失败:", "Failed to fetch content:"), error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [contentId, language])

  if (loading) {
    return (
      <Card className="rounded-xl p-6 shadow-lg border-teal-200">
        <div className="py-8 text-center text-muted-foreground">{t("加载中...", "Loading...")}</div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="rounded-xl p-6 shadow-lg border-teal-200">
        <div className="py-8 text-center text-red-500">
          {t("加载失败:", "Loading failed:")} {error}
        </div>
      </Card>
    )
  }

  if (!content) {
    return (
      <Card className="rounded-xl p-6 shadow-lg border-teal-200">
        <div className="py-8 text-center text-muted-foreground">
          {t("请从左侧选择内容", "Please select content from the left")}
        </div>
      </Card>
    )
  }

  // 根据当前语言选择显示内容
  const displayContent = language === "en" && content.content_en ? content.content_en : content.content
  const displayName = language === "en" && content.name_en ? content.name_en : content.name

  // 自定义渲染器，用于处理Mermaid代码块
  const components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "")
      const language = match && match[1]

      if (!inline && language === "mermaid") {
        return <MermaidRenderer chart={String(children).trim()} />
      }

      return (
        <code className={className} {...props}>
          {children}
        </code>
      )
    },
  }

  return (
    <Card className="rounded-xl p-6 shadow-lg border-teal-200" data-content-container="true">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-amber-600 to-teal-600 bg-clip-text text-transparent">
        {displayName}
      </h1>
      <div className="prose dark:prose-invert max-w-none" data-ai-content="true">
        {displayContent ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {displayContent}
          </ReactMarkdown>
        ) : (
          <p className="text-muted-foreground">{t("暂无内容", "No content available")}</p>
        )}
      </div>
    </Card>
  )
}
