"use client"

import { useState } from "react"
import { useLanguage } from "@/components/i18n/language-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Star } from "lucide-react"

// 定义AI工具类型
interface AITool {
  id: string
  name: string
  name_en: string
  description: string
  description_en: string
  url: string
  image_url: string
  category: string
  category_en: string
  tags: { zh: string; en: string }[]
  featured: boolean
}

// 定义AI工具分类类型
interface AIToolCategory {
  id: string
  name: string
  name_en: string
  description: string
  description_en: string
}

// 静态分类数据
const staticCategories: AIToolCategory[] = [
  {
    id: "1",
    name: "文本生成",
    name_en: "Text Generation",
    description: "用于生成各种文本内容的AI工具",
    description_en: "AI tools for generating various text content",
  },
  {
    id: "2",
    name: "图像生成",
    name_en: "Image Generation",
    description: "用于创建和编辑图像的AI工具",
    description_en: "AI tools for creating and editing images",
  },
  {
    id: "3",
    name: "音频处理",
    name_en: "Audio Processing",
    description: "用于处理和生成音频的AI工具",
    description_en: "AI tools for processing and generating audio",
  },
  {
    id: "4",
    name: "视频制作",
    name_en: "Video Creation",
    description: "用于创建和编辑视频的AI工具",
    description_en: "AI tools for creating and editing videos",
  },
  {
    id: "5",
    name: "数据分析",
    name_en: "Data Analysis",
    description: "用于分析数据的AI工具",
    description_en: "AI tools for analyzing data",
  },
  {
    id: "6",
    name: "代码开发",
    name_en: "Code Development",
    description: "用于辅助编程和代码开发的AI工具",
    description_en: "AI tools for programming and code development",
  },
  {
    id: "7",
    name: "教育学习",
    name_en: "Education",
    description: "用于教育和学习的AI工具",
    description_en: "AI tools for education and learning",
  },
  {
    id: "8",
    name: "生产力工具",
    name_en: "Productivity",
    description: "提高工作效率的AI工具",
    description_en: "AI tools for improving productivity",
  },
  {
    id: "9",
    name: "营销与销售",
    name_en: "Marketing & Sales",
    description: "用于营销和销售的AI工具",
    description_en: "AI tools for marketing and sales",
  },
  {
    id: "10",
    name: "客户服务",
    name_en: "Customer Service",
    description: "用于客户服务和支持的AI工具",
    description_en: "AI tools for customer service and support",
  },
]

// 静态工具数据 - 扩展到50种
const staticTools: AITool[] = [
  // 文本生成类
  {
    id: "1",
    name: "ChatGPT",
    name_en: "ChatGPT",
    description: "OpenAI开发的强大对话AI模型，可以理解和生成人类语言。",
    description_en:
      "Powerful conversational AI model developed by OpenAI that can understand and generate human language.",
    url: "https://chat.openai.com",
    image_url: "/chatgpt-logo-inspired.png",
    category: "文本生成",
    category_en: "Text Generation",
    tags: [
      { zh: "对话", en: "Conversation" },
      { zh: "文本生成", en: "Text Generation" },
      { zh: "AI助手", en: "AI Assistant" },
    ],
    featured: true,
  },
  {
    id: "2",
    name: "Claude",
    name_en: "Claude",
    description: "Anthropic开发的对话AI助手，专注于有用、无害和诚实的回答。",
    description_en: "Conversational AI assistant by Anthropic, focused on helpful, harmless, and honest responses.",
    url: "https://claude.ai",
    image_url: "/chatgpt-logo-inspired.png",
    category: "文本生成",
    category_en: "Text Generation",
    tags: [
      { zh: "对话", en: "Conversation" },
      { zh: "AI助手", en: "AI Assistant" },
      { zh: "文本分析", en: "Text Analysis" },
    ],
    featured: true,
  },
  {
    id: "3",
    name: "Jasper",
    name_en: "Jasper",
    description: "AI内容生成平台，用于营销和商业写作。",
    description_en: "AI content generation platform for marketing and business writing.",
    url: "https://www.jasper.ai",
    image_url: "/chatgpt-logo-inspired.png",
    category: "文本生成",
    category_en: "Text Generation",
    tags: [
      { zh: "内容创作", en: "Content Creation" },
      { zh: "营销", en: "Marketing" },
      { zh: "商业写作", en: "Business Writing" },
    ],
    featured: false,
  },
  {
    id: "4",
    name: "Copy.ai",
    name_en: "Copy.ai",
    description: "AI驱动的文案和内容生成工具，适用于营销和销售。",
    description_en: "AI-powered copywriting and content generation tool for marketing and sales.",
    url: "https://www.copy.ai",
    image_url: "/generic-abstract-logo.png",
    category: "文本生成",
    category_en: "Text Generation",
    tags: [
      { zh: "文案", en: "Copywriting" },
      { zh: "营销", en: "Marketing" },
      { zh: "内容生成", en: "Content Generation" },
    ],
    featured: false,
  },
  {
    id: "5",
    name: "Notion AI",
    name_en: "Notion AI",
    description: "集成在Notion中的AI写作助手，帮助用户创建、编辑和总结内容。",
    description_en: "AI writing assistant integrated into Notion to help users create, edit, and summarize content.",
    url: "https://www.notion.so/product/ai",
    image_url: "/ai-tool-concept.png",
    category: "文本生成",
    category_en: "Text Generation",
    tags: [
      { zh: "写作助手", en: "Writing Assistant" },
      { zh: "笔记", en: "Notes" },
      { zh: "总结", en: "Summarization" },
    ],
    featured: false,
  },

  // 图像生成类
  {
    id: "6",
    name: "Midjourney",
    name_en: "Midjourney",
    description: "高质量AI图像生成工具，通过文本描述创建艺术作品。",
    description_en: "High-quality AI image generation tool that creates artwork from text descriptions.",
    url: "https://www.midjourney.com",
    image_url: "/generic-abstract-logo.png",
    category: "图像生成",
    category_en: "Image Generation",
    tags: [
      { zh: "图像生成", en: "Image Generation" },
      { zh: "艺术创作", en: "Art Creation" },
      { zh: "设计", en: "Design" },
    ],
    featured: true,
  },
  {
    id: "7",
    name: "DALL-E",
    name_en: "DALL-E",
    description: "OpenAI的AI图像生成模型，可以根据文本提示创建详细图像。",
    description_en: "AI image generation model by OpenAI that creates detailed images from text prompts.",
    url: "https://openai.com/dall-e-3",
    image_url: "/ai-tool-concept.png",
    category: "图像生成",
    category_en: "Image Generation",
    tags: [
      { zh: "图像生成", en: "Image Generation" },
      { zh: "创意设计", en: "Creative Design" },
      { zh: "艺术", en: "Art" },
    ],
    featured: true,
  },
  {
    id: "8",
    name: "Stable Diffusion",
    name_en: "Stable Diffusion",
    description: "开源的AI图像生成模型，可以在本地运行。",
    description_en: "Open-source AI image generation model that can run locally.",
    url: "https://stability.ai",
    image_url: "/generic-abstract-logo.png",
    category: "图像生成",
    category_en: "Image Generation",
    tags: [
      { zh: "图像生成", en: "Image Generation" },
      { zh: "开源", en: "Open Source" },
      { zh: "本地部署", en: "Local Deployment" },
    ],
    featured: false,
  },
  {
    id: "9",
    name: "Canva AI",
    name_en: "Canva AI",
    description: "Canva的AI设计工具，包括图像生成、文本生成和设计建议。",
    description_en: "Canva's AI design tools including image generation, text generation, and design suggestions.",
    url: "https://www.canva.com",
    image_url: "/ai-tool-concept.png",
    category: "图像生成",
    category_en: "Image Generation",
    tags: [
      { zh: "设计", en: "Design" },
      { zh: "图像生成", en: "Image Generation" },
      { zh: "营销素材", en: "Marketing Materials" },
    ],
    featured: false,
  },
  {
    id: "10",
    name: "Leonardo.AI",
    name_en: "Leonardo.AI",
    description: "为游戏开发者和创意专业人士设计的AI图像生成平台。",
    description_en: "AI image generation platform designed for game developers and creative professionals.",
    url: "https://leonardo.ai",
    image_url: "/generic-abstract-logo.png",
    category: "图像生成",
    category_en: "Image Generation",
    tags: [
      { zh: "游戏开发", en: "Game Development" },
      { zh: "图像生成", en: "Image Generation" },
      { zh: "创意设计", en: "Creative Design" },
    ],
    featured: false,
  },

  // 音频处理类
  {
    id: "11",
    name: "Descript",
    name_en: "Descript",
    description: "AI驱动的音频和视频编辑工具，包括转录和语音克隆功能。",
    description_en: "AI-powered audio and video editing tool with transcription and voice cloning capabilities.",
    url: "https://www.descript.com",
    image_url: "/ai-tool-concept.png",
    category: "音频处理",
    category_en: "Audio Processing",
    tags: [
      { zh: "音频编辑", en: "Audio Editing" },
      { zh: "转录", en: "Transcription" },
      { zh: "语音克隆", en: "Voice Cloning" },
    ],
    featured: false,
  },
  {
    id: "12",
    name: "Murf AI",
    name_en: "Murf AI",
    description: "AI语音生成器，提供自然的文本转语音功能和多种声音选择。",
    description_en: "AI voice generator offering natural text-to-speech and a variety of voice options.",
    url: "https://murf.ai",
    image_url: "/generic-abstract-logo.png",
    category: "音频处理",
    category_en: "Audio Processing",
    tags: [
      { zh: "文本转语音", en: "Text-to-Speech" },
      { zh: "配音", en: "Voice Over" },
      { zh: "语音合成", en: "Voice Synthesis" },
    ],
    featured: false,
  },
  {
    id: "13",
    name: "Krisp",
    name_en: "Krisp",
    description: "AI噪音消除工具，可以在通话和录音中消除背景噪音。",
    description_en: "AI noise cancellation tool that removes background noise in calls and recordings.",
    url: "https://krisp.ai",
    image_url: "/ai-tool-concept.png",
    category: "音频处理",
    category_en: "Audio Processing",
    tags: [
      { zh: "噪音消除", en: "Noise Cancellation" },
      { zh: "音频增强", en: "Audio Enhancement" },
      { zh: "远程会议", en: "Remote Meetings" },
    ],
    featured: false,
  },
  {
    id: "14",
    name: "Resemble AI",
    name_en: "Resemble AI",
    description: "AI语音克隆和合成平台，可以创建逼真的人工语音。",
    description_en: "AI voice cloning and synthesis platform for creating realistic artificial voices.",
    url: "https://www.resemble.ai",
    image_url: "/generic-abstract-logo.png",
    category: "音频处理",
    category_en: "Audio Processing",
    tags: [
      { zh: "语音克隆", en: "Voice Cloning" },
      { zh: "语音合成", en: "Voice Synthesis" },
      { zh: "配音", en: "Voice Over" },
    ],
    featured: false,
  },
  {
    id: "15",
    name: "Soundraw",
    name_en: "Soundraw",
    description: "AI音乐生成器，可以创建免版税的原创音乐。",
    description_en: "AI music generator that creates royalty-free original music.",
    url: "https://soundraw.io",
    image_url: "/ai-tool-concept.png",
    category: "音频处理",
    category_en: "Audio Processing",
    tags: [
      { zh: "音乐生成", en: "Music Generation" },
      { zh: "配乐", en: "Soundtrack" },
      { zh: "创作", en: "Composition" },
    ],
    featured: false,
  },

  // 视频制作类
  {
    id: "16",
    name: "RunwayML",
    name_en: "RunwayML",
    description: "AI创意工具套件，用于视频编辑、生成和修改。",
    description_en: "AI creative toolkit for video editing, generation, and modification.",
    url: "https://runwayml.com",
    image_url: "/generic-abstract-logo.png",
    category: "视频制作",
    category_en: "Video Creation",
    tags: [
      { zh: "视频编辑", en: "Video Editing" },
      { zh: "视频生成", en: "Video Generation" },
      { zh: "创意工具", en: "Creative Tools" },
    ],
    featured: true,
  },
  {
    id: "17",
    name: "Synthesia",
    name_en: "Synthesia",
    description: "AI视频生成平台，可以创建逼真的AI演示者视频。",
    description_en: "AI video generation platform that creates realistic AI presenter videos.",
    url: "https://www.synthesia.io",
    image_url: "/ai-tool-concept.png",
    category: "视频制作",
    category_en: "Video Creation",
    tags: [
      { zh: "视频生成", en: "Video Generation" },
      { zh: "AI演示者", en: "AI Presenters" },
      { zh: "培训视频", en: "Training Videos" },
    ],
    featured: false,
  },
  {
    id: "18",
    name: "Lumen5",
    name_en: "Lumen5",
    description: "AI视频创建平台，可以将文本内容转换为视频。",
    description_en: "AI video creation platform that transforms text content into videos.",
    url: "https://lumen5.com",
    image_url: "/generic-abstract-logo.png",
    category: "视频制作",
    category_en: "Video Creation",
    tags: [
      { zh: "视频营销", en: "Video Marketing" },
      { zh: "内容转换", en: "Content Conversion" },
      { zh: "社交媒体", en: "Social Media" },
    ],
    featured: false,
  },
  {
    id: "19",
    name: "Elai.io",
    name_en: "Elai.io",
    description: "AI视频生成平台，只需上传文本即可创建带有AI演示者的视频。",
    description_en: "AI video generation platform that creates videos with AI presenters from just text.",
    url: "https://elai.io",
    image_url: "/ai-tool-concept.png",
    category: "视频制作",
    category_en: "Video Creation",
    tags: [
      { zh: "AI演示者", en: "AI Presenters" },
      { zh: "视频生成", en: "Video Generation" },
      { zh: "营销", en: "Marketing" },
    ],
    featured: false,
  },
  {
    id: "20",
    name: "Pictory",
    name_en: "Pictory",
    description: "AI视频创建工具，可以从长篇内容中自动创建短视频。",
    description_en: "AI video creation tool that automatically creates short videos from long-form content.",
    url: "https://pictory.ai",
    image_url: "/generic-abstract-logo.png",
    category: "视频制作",
    category_en: "Video Creation",
    tags: [
      { zh: "内容重用", en: "Content Repurposing" },
      { zh: "短视频", en: "Short Videos" },
      { zh: "社交媒体", en: "Social Media" },
    ],
    featured: false,
  },

  // 数据分析类
  {
    id: "21",
    name: "Obviously AI",
    name_en: "Obviously AI",
    description: "无代码AI数据分析平台，可以预测趋势和自动化决策。",
    description_en: "No-code AI data analysis platform for predicting trends and automating decisions.",
    url: "https://www.obviously.ai",
    image_url: "/ai-tool-concept.png",
    category: "数据分析",
    category_en: "Data Analysis",
    tags: [
      { zh: "预测分析", en: "Predictive Analytics" },
      { zh: "无代码", en: "No-Code" },
      { zh: "机器学习", en: "Machine Learning" },
    ],
    featured: false,
  },
  {
    id: "22",
    name: "Akkio",
    name_en: "Akkio",
    description: "简单易用的AI预测分析平台，无需数据科学专业知识。",
    description_en: "Easy-to-use AI predictive analytics platform requiring no data science expertise.",
    url: "https://www.akkio.com",
    image_url: "/generic-abstract-logo.png",
    category: "数据分析",
    category_en: "Data Analysis",
    tags: [
      { zh: "预测分析", en: "Predictive Analytics" },
      { zh: "业务智能", en: "Business Intelligence" },
      { zh: "自动化", en: "Automation" },
    ],
    featured: false,
  },
  {
    id: "23",
    name: "MonkeyLearn",
    name_en: "MonkeyLearn",
    description: "AI文本分析平台，用于情感分析、分类和提取。",
    description_en: "AI text analysis platform for sentiment analysis, classification, and extraction.",
    url: "https://monkeylearn.com",
    image_url: "/ai-tool-concept.png",
    category: "数据分析",
    category_en: "Data Analysis",
    tags: [
      { zh: "文本分析", en: "Text Analysis" },
      { zh: "情感分析", en: "Sentiment Analysis" },
      { zh: "数据提取", en: "Data Extraction" },
    ],
    featured: false,
  },
  {
    id: "24",
    name: "Tableau",
    name_en: "Tableau",
    description: "集成AI功能的数据可视化和分析平台。",
    description_en: "Data visualization and analytics platform with integrated AI capabilities.",
    url: "https://www.tableau.com",
    image_url: "/generic-abstract-logo.png",
    category: "数据分析",
    category_en: "Data Analysis",
    tags: [
      { zh: "数据可视化", en: "Data Visualization" },
      { zh: "业务智能", en: "Business Intelligence" },
      { zh: "分析", en: "Analytics" },
    ],
    featured: true,
  },
  {
    id: "25",
    name: "DataRobot",
    name_en: "DataRobot",
    description: "企业级AI平台，用于自动化机器学习和预测建模。",
    description_en: "Enterprise AI platform for automated machine learning and predictive modeling.",
    url: "https://www.datarobot.com",
    image_url: "/ai-tool-concept.png",
    category: "数据分析",
    category_en: "Data Analysis",
    tags: [
      { zh: "自动化机器学习", en: "Automated Machine Learning" },
      { zh: "预测建模", en: "Predictive Modeling" },
      { zh: "企业AI", en: "Enterprise AI" },
    ],
    featured: false,
  },

  // 代码开发类
  {
    id: "26",
    name: "GitHub Copilot",
    name_en: "GitHub Copilot",
    description: "AI编程助手，可以根据注释和上下文生成代码。",
    description_en: "AI programming assistant that generates code based on comments and context.",
    url: "https://github.com/features/copilot",
    image_url: "/generic-abstract-logo.png",
    category: "代码开发",
    category_en: "Code Development",
    tags: [
      { zh: "代码生成", en: "Code Generation" },
      { zh: "编程助手", en: "Programming Assistant" },
      { zh: "开发工具", en: "Development Tools" },
    ],
    featured: true,
  },
  {
    id: "27",
    name: "Tabnine",
    name_en: "Tabnine",
    description: "AI代码完成工具，支持多种编程语言和IDE。",
    description_en: "AI code completion tool supporting multiple programming languages and IDEs.",
    url: "https://www.tabnine.com",
    image_url: "/ai-tool-concept.png",
    category: "代码开发",
    category_en: "Code Development",
    tags: [
      { zh: "代码完成", en: "Code Completion" },
      { zh: "开发工具", en: "Development Tools" },
      { zh: "生产力", en: "Productivity" },
    ],
    featured: false,
  },
  {
    id: "28",
    name: "Replit Ghostwriter",
    name_en: "Replit Ghostwriter",
    description: "Replit的AI编码助手，可以生成、完成和解释代码。",
    description_en: "Replit's AI coding assistant that generates, completes, and explains code.",
    url: "https://replit.com/ghostwriter",
    image_url: "/generic-abstract-logo.png",
    category: "代码开发",
    category_en: "Code Development",
    tags: [
      { zh: "代码生成", en: "Code Generation" },
      { zh: "代码解释", en: "Code Explanation" },
      { zh: "在线IDE", en: "Online IDE" },
    ],
    featured: false,
  },
  {
    id: "29",
    name: "CodeWhisperer",
    name_en: "CodeWhisperer",
    description: "亚马逊的AI代码生成工具，专为AWS开发者设计。",
    description_en: "Amazon's AI code generation tool designed for AWS developers.",
    url: "https://aws.amazon.com/codewhisperer",
    image_url: "/ai-tool-concept.png",
    category: "代码开发",
    category_en: "Code Development",
    tags: [
      { zh: "代码生成", en: "Code Generation" },
      { zh: "AWS", en: "AWS" },
      { zh: "云开发", en: "Cloud Development" },
    ],
    featured: false,
  },
  {
    id: "30",
    name: "Codeium",
    name_en: "Codeium",
    description: "免费的AI代码完成和搜索工具，支持多种编程语言。",
    description_en: "Free AI code completion and search tool supporting multiple programming languages.",
    url: "https://codeium.com",
    image_url: "/generic-abstract-logo.png",
    category: "代码开发",
    category_en: "Code Development",
    tags: [
      { zh: "代码完成", en: "Code Completion" },
      { zh: "代码搜索", en: "Code Search" },
      { zh: "免费工具", en: "Free Tools" },
    ],
    featured: false,
  },

  // 教育学习类
  {
    id: "31",
    name: "Duolingo Max",
    name_en: "Duolingo Max",
    description: "Duolingo的AI增强版，提供个性化语言学习体验。",
    description_en: "AI-enhanced version of Duolingo offering personalized language learning experiences.",
    url: "https://www.duolingo.com",
    image_url: "/ai-tool-concept.png",
    category: "教育学习",
    category_en: "Education",
    tags: [
      { zh: "语言学习", en: "Language Learning" },
      { zh: "个性化教育", en: "Personalized Education" },
      { zh: "移动应用", en: "Mobile App" },
    ],
    featured: false,
  },
  {
    id: "32",
    name: "Quizlet",
    name_en: "Quizlet",
    description: "AI驱动的学习平台，提供智能学习卡和个性化学习路径。",
    description_en: "AI-powered learning platform offering smart flashcards and personalized learning paths.",
    url: "https://quizlet.com",
    image_url: "/generic-abstract-logo.png",
    category: "教育学习",
    category_en: "Education",
    tags: [
      { zh: "学习卡", en: "Flashcards" },
      { zh: "学习工具", en: "Study Tools" },
      { zh: "个性化学习", en: "Personalized Learning" },
    ],
    featured: false,
  },
  {
    id: "33",
    name: "Khan Academy Khanmigo",
    name_en: "Khan Academy Khanmigo",
    description: "Khan Academy的AI导师，提供个性化辅导和学习支持。",
    description_en: "Khan Academy's AI tutor offering personalized tutoring and learning support.",
    url: "https://www.khanacademy.org/khanmigo",
    image_url: "/ai-tool-concept.png",
    category: "教育学习",
    category_en: "Education",
    tags: [
      { zh: "AI导师", en: "AI Tutor" },
      { zh: "个性化学习", en: "Personalized Learning" },
      { zh: "教育科技", en: "EdTech" },
    ],
    featured: true,
  },
  {
    id: "34",
    name: "Grammarly",
    name_en: "Grammarly",
    description: "AI写作助手，提供语法检查、拼写纠正和写作建议。",
    description_en: "AI writing assistant offering grammar checking, spell correction, and writing suggestions.",
    url: "https://www.grammarly.com",
    image_url: "/generic-abstract-logo.png",
    category: "教育学习",
    category_en: "Education",
    tags: [
      { zh: "写作助手", en: "Writing Assistant" },
      { zh: "语法检查", en: "Grammar Checking" },
      { zh: "英语学习", en: "English Learning" },
    ],
    featured: true,
  },
  {
    id: "35",
    name: "Coursera AI Academy",
    name_en: "Coursera AI Academy",
    description: "Coursera的AI学习平台，提供AI相关课程和个性化学习路径。",
    description_en: "Coursera's AI learning platform offering AI-related courses and personalized learning paths.",
    url: "https://www.coursera.org",
    image_url: "/ai-tool-concept.png",
    category: "教育学习",
    category_en: "Education",
    tags: [
      { zh: "在线课程", en: "Online Courses" },
      { zh: "AI学习", en: "AI Learning" },
      { zh: "职业发展", en: "Career Development" },
    ],
    featured: false,
  },

  // 生产力工具类
  {
    id: "36",
    name: "Otter.ai",
    name_en: "Otter.ai",
    description: "AI会议助手，提供实时转录、摘要和协作笔记。",
    description_en: "AI meeting assistant offering real-time transcription, summaries, and collaborative notes.",
    url: "https://otter.ai",
    image_url: "/generic-abstract-logo.png",
    category: "生产力工具",
    category_en: "Productivity",
    tags: [
      { zh: "会议转录", en: "Meeting Transcription" },
      { zh: "笔记", en: "Notes" },
      { zh: "协作", en: "Collaboration" },
    ],
    featured: false,
  },
  {
    id: "37",
    name: "Mem.ai",
    name_en: "Mem.ai",
    description: "AI驱动的笔记和知识管理工具，自动组织和连接信息。",
    description_en:
      "AI-powered note-taking and knowledge management tool that automatically organizes and connects information.",
    url: "https://mem.ai",
    image_url: "/ai-tool-concept.png",
    category: "生产力工具",
    category_en: "Productivity",
    tags: [
      { zh: "笔记", en: "Notes" },
      { zh: "知识管理", en: "Knowledge Management" },
      { zh: "个人助手", en: "Personal Assistant" },
    ],
    featured: false,
  },
  {
    id: "38",
    name: "Taskade",
    name_en: "Taskade",
    description: "AI驱动的项目管理和协作工具，集成任务、笔记和聊天。",
    description_en: "AI-powered project management and collaboration tool integrating tasks, notes, and chat.",
    url: "https://www.taskade.com",
    image_url: "/generic-abstract-logo.png",
    category: "生产力工具",
    category_en: "Productivity",
    tags: [
      { zh: "项目管理", en: "Project Management" },
      { zh: "协作", en: "Collaboration" },
      { zh: "任务管理", en: "Task Management" },
    ],
    featured: false,
  },
  {
    id: "39",
    name: "Fireflies.ai",
    name_en: "Fireflies.ai",
    description: "AI会议助手，自动记录、转录和分析会议。",
    description_en: "AI meeting assistant that automatically records, transcribes, and analyzes meetings.",
    url: "https://fireflies.ai",
    image_url: "/ai-tool-concept.png",
    category: "生产力工具",
    category_en: "Productivity",
    tags: [
      { zh: "会议转录", en: "Meeting Transcription" },
      { zh: "会议分析", en: "Meeting Analysis" },
      { zh: "远程工作", en: "Remote Work" },
    ],
    featured: false,
  },
  {
    id: "40",
    name: "Todoist",
    name_en: "Todoist",
    description: "集成AI功能的任务管理工具，帮助用户更有效地组织任务。",
    description_en: "Task management tool with integrated AI features to help users organize tasks more effectively.",
    url: "https://todoist.com",
    image_url: "/generic-abstract-logo.png",
    category: "生产力工具",
    category_en: "Productivity",
    tags: [
      { zh: "任务管理", en: "Task Management" },
      { zh: "生产力", en: "Productivity" },
      { zh: "个人组织", en: "Personal Organization" },
    ],
    featured: false,
  },

  // 营销与销售类
  {
    id: "41",
    name: "HubSpot AI",
    name_en: "HubSpot AI",
    description: "HubSpot的AI功能，用于内容创建、客户服务和销售。",
    description_en: "HubSpot's AI features for content creation, customer service, and sales.",
    url: "https://www.hubspot.com",
    image_url: "/ai-tool-concept.png",
    category: "营销与销售",
    category_en: "Marketing & Sales",
    tags: [
      { zh: "营销自动化", en: "Marketing Automation" },
      { zh: "CRM", en: "CRM" },
      { zh: "内容创建", en: "Content Creation" },
    ],
    featured: true,
  },
  {
    id: "42",
    name: "Persado",
    name_en: "Persado",
    description: "AI营销语言生成平台，创建高转化率的营销文案。",
    description_en: "AI marketing language generation platform that creates high-converting marketing copy.",
    url: "https://www.persado.com",
    image_url: "/generic-abstract-logo.png",
    category: "营销与销售",
    category_en: "Marketing & Sales",
    tags: [
      { zh: "营销文案", en: "Marketing Copy" },
      { zh: "语言优化", en: "Language Optimization" },
      { zh: "转化率优化", en: "Conversion Optimization" },
    ],
    featured: false,
  },
  {
    id: "43",
    name: "Drift",
    name_en: "Drift",
    description: "AI驱动的对话营销平台，通过聊天机器人吸引网站访问者。",
    description_en: "AI-powered conversational marketing platform that engages website visitors through chatbots.",
    url: "https://www.drift.com",
    image_url: "/ai-tool-concept.png",
    category: "营销与销售",
    category_en: "Marketing & Sales",
    tags: [
      { zh: "聊天机器人", en: "Chatbots" },
      { zh: "对话营销", en: "Conversational Marketing" },
      { zh: "销售自动化", en: "Sales Automation" },
    ],
    featured: false,
  },
  {
    id: "44",
    name: "Mailchimp AI",
    name_en: "Mailchimp AI",
    description: "Mailchimp的AI功能，用于电子邮件营销和内容创建。",
    description_en: "Mailchimp's AI features for email marketing and content creation.",
    url: "https://mailchimp.com",
    image_url: "/generic-abstract-logo.png",
    category: "营销与销售",
    category_en: "Marketing & Sales",
    tags: [
      { zh: "电子邮件营销", en: "Email Marketing" },
      { zh: "内容创建", en: "Content Creation" },
      { zh: "营销自动化", en: "Marketing Automation" },
    ],
    featured: false,
  },
  {
    id: "45",
    name: "Salesforce Einstein",
    name_en: "Salesforce Einstein",
    description: "Salesforce的AI平台，提供销售、服务和营销智能。",
    description_en: "Salesforce's AI platform offering sales, service, and marketing intelligence.",
    url: "https://www.salesforce.com/products/einstein/overview",
    image_url: "/ai-tool-concept.png",
    category: "营销与销售",
    category_en: "Marketing & Sales",
    tags: [
      { zh: "CRM", en: "CRM" },
      { zh: "销售智能", en: "Sales Intelligence" },
      { zh: "预测分析", en: "Predictive Analytics" },
    ],
    featured: true,
  },

  // 客户服务类
  {
    id: "46",
    name: "Intercom",
    name_en: "Intercom",
    description: "AI驱动的客户服务平台，提供聊天机器人和自动化支持。",
    description_en: "AI-powered customer service platform offering chatbots and automated support.",
    url: "https://www.intercom.com",
    image_url: "/generic-abstract-logo.png",
    category: "客户服务",
    category_en: "Customer Service",
    tags: [
      { zh: "聊天机器人", en: "Chatbots" },
      { zh: "客户支持", en: "Customer Support" },
      { zh: "自动化", en: "Automation" },
    ],
    featured: false,
  },
  {
    id: "47",
    name: "Zendesk AI",
    name_en: "Zendesk AI",
    description: "Zendesk的AI功能，用于自动化客户服务和支持。",
    description_en: "Zendesk's AI features for automating customer service and support.",
    url: "https://www.zendesk.com",
    image_url: "/ai-tool-concept.png",
    category: "客户服务",
    category_en: "Customer Service",
    tags: [
      { zh: "客户支持", en: "Customer Support" },
      { zh: "服务台", en: "Help Desk" },
      { zh: "自动化", en: "Automation" },
    ],
    featured: false,
  },
  {
    id: "48",
    name: "Ada",
    name_en: "Ada",
    description: "AI客户服务平台，提供自动化支持和个性化体验。",
    description_en: "AI customer service platform offering automated support and personalized experiences.",
    url: "https://www.ada.cx",
    image_url: "/generic-abstract-logo.png",
    category: "客户服务",
    category_en: "Customer Service",
    tags: [
      { zh: "聊天机器人", en: "Chatbots" },
      { zh: "自动化支持", en: "Automated Support" },
      { zh: "客户体验", en: "Customer Experience" },
    ],
    featured: false,
  },
  {
    id: "49",
    name: "Kustomer",
    name_en: "Kustomer",
    description: "AI驱动的CRM平台，专为客户服务团队设计。",
    description_en: "AI-powered CRM platform designed for customer service teams.",
    url: "https://www.kustomer.com",
    image_url: "/ai-tool-concept.png",
    category: "客户服务",
    category_en: "Customer Service",
    tags: [
      { zh: "CRM", en: "CRM" },
      { zh: "客户服务", en: "Customer Service" },
      { zh: "全渠道支持", en: "Omnichannel Support" },
    ],
    featured: false,
  },
  {
    id: "50",
    name: "Forethought",
    name_en: "Forethought",
    description: "AI客户服务平台，提供自动分类、路由和解决方案。",
    description_en: "AI customer service platform offering automatic classification, routing, and resolution.",
    url: "https://forethought.ai",
    image_url: "/generic-abstract-logo.png",
    category: "客户服务",
    category_en: "Customer Service",
    tags: [
      { zh: "客户支持", en: "Customer Support" },
      { zh: "AI分类", en: "AI Classification" },
      { zh: "自动化", en: "Automation" },
    ],
    featured: false,
  },
]

export default function AIToolsPage() {
  const { language } = useLanguage()
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // 过滤工具
  const filteredTools = staticTools.filter((tool) => {
    const matchesCategory =
      activeCategory === "all" || tool.category === activeCategory || tool.category_en === activeCategory
    const toolName = language === "zh" ? tool.name : tool.name_en
    const toolDescription = language === "zh" ? tool.description : tool.description_en
    const matchesSearch =
      searchQuery === "" ||
      toolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      toolDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tool.tags &&
        tool.tags.some((tag) =>
          (language === "zh" ? tag.zh : tag.en).toLowerCase().includes(searchQuery.toLowerCase()),
        ))

    return matchesCategory && matchesSearch
  })

  // 获取工具名称和描述
  const getToolName = (tool: AITool) => (language === "zh" ? tool.name : tool.name_en)
  const getToolDescription = (tool: AITool) => (language === "zh" ? tool.description : tool.description_en)
  const getCategoryName = (category: AIToolCategory) => (language === "zh" ? category.name : category.name_en)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {language === "zh" ? "AI工具导航" : "AI Tools Directory"}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {language === "zh"
            ? "发现和探索最新、最强大的AI工具，提升您的工作效率和创造力。"
            : "Discover and explore the latest and most powerful AI tools to boost your productivity and creativity."}
        </p>
      </div>

      {/* 搜索框 */}
      <div className="mb-8">
        <input
          type="text"
          placeholder={language === "zh" ? "搜索AI工具..." : "Search AI tools..."}
          className="w-full max-w-md mx-auto block px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* 分类标签 */}
      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
        <TabsList className="flex flex-wrap justify-center mb-4">
          <TabsTrigger value="all">{language === "zh" ? "全部" : "All"}</TabsTrigger>
          {staticCategories.map((category) => (
            <TabsTrigger key={category.id} value={language === "zh" ? category.name : category.name_en}>
              {getCategoryName(category)}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* 工具卡片 */}
        <TabsContent value={activeCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.length > 0 ? (
              filteredTools.map((tool) => (
                <Card key={tool.id} className="overflow-hidden h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{getToolName(tool)}</CardTitle>
                      {tool.featured && (
                        <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full flex items-center">
                          <Star size={12} className="mr-1" />
                          {language === "zh" ? "推荐" : "Featured"}
                        </span>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2">{getToolDescription(tool)}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="aspect-video bg-gray-100 rounded-md overflow-hidden mb-4">
                      <img
                        src={tool.image_url || "/placeholder.svg?height=200&width=300&query=AI+tool"}
                        alt={getToolName(tool)}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/ai-tool-concept.png"
                        }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tool.tags &&
                        tool.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                            {language === "zh" ? tag.zh : tag.en}
                          </span>
                        ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      {language === "zh" ? "访问工具" : "Visit Tool"}
                    </a>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-muted-foreground">
                  {language === "zh" ? "没有找到匹配的工具" : "No matching tools found"}
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
