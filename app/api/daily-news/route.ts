import { NextResponse } from "next/server"
import { format } from "date-fns"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

// 允许响应流式传输最多60秒
export const maxDuration = 60

// Tavily API密钥
const TAVILY_API_KEY = process.env.TAVILY_API_KEY

// 内存缓存 - 为每种语言分别存储缓存
const newsCache: {
  [lang: string]: {
    summary: string
    date: string
    lastUpdated: string
    newsCount?: number
  } | null
} = {
  zh: null,
  en: null,
}

// 检查缓存是否需要更新
function shouldUpdateCache(lang: string, forceUpdate = false): boolean {
  if (forceUpdate || !newsCache[lang]) return true

  const now = new Date()
  const lastUpdated = new Date(newsCache[lang]!.lastUpdated)
  const diffHours = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60)

  // 如果上次更新超过12小时，则需要更新
  return diffHours >= 12
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
    // 移除其他可能的变体
    .replace(/<Thinking>[\s\S]*?<\/thinking>/gi, "")
    .replace(/<Thinking>[\s\S]*?<\/think>/gi, "")

  return cleanedText
}

export async function GET(request: Request) {
  // 获取URL参数
  const url = new URL(request.url)
  const forceUpdate = url.searchParams.get("force") === "true"
  const lang = url.searchParams.get("lang") || "zh" // 默认为中文

  try {
    // 检查是否需要更新缓存
    const needsUpdate = shouldUpdateCache(lang, forceUpdate)

    // 如果不需要更新，直接返回缓存的数据
    if (!needsUpdate && newsCache[lang]) {
      return NextResponse.json({
        summary: newsCache[lang]!.summary,
        date: newsCache[lang]!.date,
        newsCount: newsCache[lang]!.newsCount,
        fromCache: true,
      })
    }

    // 需要更新，获取新数据
    // 获取当前日期
    const today = format(new Date(), "yyyy-MM-dd")

    // 构建搜索查询 - 根据语言调整查询
    const query = lang === "zh" ? `New Zealand Today's News ${today}` : `New Zealand Today's News ${today}`

    console.log(`开始搜索新闻 (${lang}):`, query)

    // 调用Tavily API搜索新闻
    const tavilyResponse = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TAVILY_API_KEY}`,
      },
      body: JSON.stringify({
        query,
        search_depth: "advanced",
        include_domains: ["nzherald.co.nz", "stuff.co.nz", "rnz.co.nz", "newshub.co.nz", "tvnz.co.nz"],
        max_results: 5,
        include_answer: false,
        include_images: false,
        include_raw_content: true,
      }),
    })

    if (!tavilyResponse.ok) {
      const errorData = await tavilyResponse.json()
      throw new Error(`Tavily API错误: ${JSON.stringify(errorData)}`)
    }

    const tavilyData = await tavilyResponse.json()
    console.log("Tavily搜索结果:", tavilyData.results.length)

    // 处理搜索结果
    const newsItems = tavilyData.results
      .filter((result: any) => result.content && result.title)
      .slice(0, 5) // 只取前5条新闻
      .map((result: any) => ({
        title: result.title,
        content: result.content,
        date: format(new Date(), "yyyy-MM-dd"),
        url: result.url,
        source: new URL(result.url).hostname.replace("www.", ""),
      }))

    if (newsItems.length === 0) {
      throw new Error(lang === "zh" ? "未找到相关新闻" : "No relevant news found")
    }

    // 构建提示词，将所有新闻内容合并
    const newsContent = newsItems
      .map(
        (item: any, index: number) => `${lang === "zh" ? "新闻" : "News"} ${index + 1}:
${lang === "zh" ? "标题" : "Title"}: ${item.title}
${lang === "zh" ? "来源" : "Source"}: ${item.source}
${lang === "zh" ? "链接" : "Link"}: ${item.url}
${lang === "zh" ? "内容" : "Content"}: ${item.content.slice(0, 1000)}...
`,
      )
      .join("\n\n")

    // 使用Groq AI总结和翻译新闻
    console.log(`开始使用Groq AI总结新闻 (${lang})`)

    // 根据语言选择系统提示词
    const systemPrompt =
      lang === "zh"
        ? `
你是一位资深的国际新闻编辑和翻译专家，精通中英文，擅长将英文新闻准确翻译并制作成高质量的中文新闻摘要。

## 你的专业能力：
1. 精准把握新闻核心，提炼关键信息
2. 理解新闻背景和上下文，提供深度解读
3. 使用专业、流畅的中文表达
4. 保持新闻的客观性和准确性
5. 能够识别新闻中的重要数据和关键人物

## 输出要求：
1. 使用清晰、专业的中文新闻报道风格
2. 每条新闻摘要应包含事件背景、关键事实、相关影响
3. 保留重要的数字、日期、人名和地点
4. 使用Markdown格式增强可读性
5. 为每条新闻提供简短但有见地的分析
6. 确保内容既适合普通读者，也能满足关注新西兰时事的专业人士需求
7. 不要在回复中包含任何<Thinking>、</Thinking>、<Think>、</Think>等思考标签
`
        : `
You are a professional international news editor and expert, skilled at summarizing news accurately and creating high-quality English news summaries.

## Your professional abilities:
1. Precisely grasp the core of news, extract key information
2. Understand news background and context, provide in-depth interpretation
3. Use professional, fluent English expression
4. Maintain objectivity and accuracy of news
5. Identify important data and key figures in the news

## Output requirements:
1. Use clear, professional English news reporting style
2. Each news summary should include event background, key facts, and related impacts
3. Retain important numbers, dates, names, and locations
4. Use Markdown format to enhance readability
5. Provide brief but insightful analysis for each news item
6. Ensure content is suitable for both general readers and professionals interested in New Zealand current affairs
7. Do not include any <Thinking>, </Thinking>, <Think>, </Think> or similar tags in your response
`

    // 根据语言选择提示词
    const prompt =
      lang === "zh"
        ? `
请将以下新西兰今日新闻翻译并制作成一份高质量的中文日报，包含5个重要新闻要点：

${newsContent}

## 输出格式要求：

# 新西兰今日要闻 (${today})

## 今日概览
(用3-4句话概括今天新西兰的整体新闻趋势、重要事件和可能的影响，突出最重要的1-2条新闻)

## 新闻详情

### 1. [第一条新闻标题的准确中文翻译]
(第一条新闻的详细中文摘要，包含:
- 事件的背景和起因
- 关键人物和组织
- 重要数据和事实
- 可能的影响和后续发展
摘要应为150-200中文字，保持专业新闻风格)
[原文链接](对应的URL)

### 2. [第二条新闻标题的准确中文翻译]
(同上，详细摘要)
[原文链接](对应的URL)

...以此类推完成所有新闻

## 今日分析
(对今日新闻的综合分析，包括:
- 这些新闻反映的新西兰社会、经济或政治趋势
- 对中国或国际读者可能有的参考价值
- 值得持续关注的发展方向
分析应为150-200字，既有深度又易于理解)

## 词汇表
(列出3-5个新闻中出现的专业术语或新西兰特有表达，并提供简短解释)

注意：请不要在回复中包含任何<Thinking>、</Thinking>、<Think>、</Think>等思考标签。
`
        : `
Please summarize the following New Zealand news from today into a high-quality English daily report, including 5 important news points:

${newsContent}

## Output Format Requirements:

# New Zealand Today's Headlines (${today})

## Today's Overview
(Summarize New Zealand's overall news trends, important events, and possible impacts in 3-4 sentences, highlighting the 1-2 most important news items)

## News Details

### 1. [First news headline]
(Detailed summary of the first news item, including:
- Background and cause of the event
- Key people and organizations
- Important data and facts
- Possible impacts and future developments
Summary should be 150-200 words, maintaining a professional news style)
[Original link](corresponding URL)

### 2. [Second news headline]
(Same as above, detailed summary)
[Original link](corresponding URL)

...continue for all news items

## Today's Analysis
(Comprehensive analysis of today's news, including:
- What these news items reflect about New Zealand's social, economic, or political trends
- Potential reference value for international readers
- Developments worth continuing to follow
Analysis should be 150-200 words, both in-depth and easy to understand)

## Glossary
(List 3-5 professional terms or New Zealand-specific expressions that appear in the news, and provide brief explanations)

Note: Please do not include any <Thinking>, </Thinking>, <Think>, </Think> or similar tags in your response.
`

    try {
      // 使用Groq AI进行总结和翻译
      const { text } = await generateText({
        model: groq("deepseek-r1-distill-llama-70b"),
        prompt,
        system: systemPrompt,
        temperature: 0.3,
        maxTokens: 2500, // 增加token上限以容纳更详细的内容
      })

      console.log(`Groq AI总结完成 (${lang})`)

      // 清理AI响应中的标签内容
      const cleanedText = cleanResponse(text)

      // 保存到内存缓存
      newsCache[lang] = {
        summary: cleanedText,
        date: today,
        lastUpdated: new Date().toISOString(),
        newsCount: newsItems.length,
      }

      return NextResponse.json({
        summary: cleanedText,
        date: today,
        newsCount: newsItems.length,
        fromCache: false,
      })
    } catch (groqError) {
      console.error(`Groq API错误 (${lang}):`, groqError)

      // 备用提示词，简化但仍保持一定质量
      const backupPrompt =
        lang === "zh"
          ? `
请将以下新西兰今日新闻总结为中文日报，简明扼要但内容丰富：

${newsItems
  .map(
    (item: any) => `${item.title}
${item.content.slice(0, 500)}`,
  )
  .join("\n\n")}

请用专业的中文新闻风格总结这些新闻的要点，包括事件背景、关键事实和可能的影响。使用Markdown格式增强可读性，并为每条新闻提供简短分析。

注意：请不要在回复中包含任何<Thinking>、</Thinking>、<Think>、</Think>等思考标签。
`
          : `
Please summarize the following New Zealand news from today into an English daily report, concise yet informative:

${newsItems
  .map(
    (item: any) => `${item.title}
${item.content.slice(0, 500)}`,
  )
  .join("\n\n")}

Please use a professional English news style to summarize the key points of these news items, including event background, key facts, and possible impacts. Use Markdown format to enhance readability, and provide brief analysis for each news item.

Note: Please do not include any <Thinking>, </Thinking>, <Think>, </Think> or similar tags in your response.
`

      try {
        const { text } = await generateText({
          model: groq("deepseek-r1-distill-llama-70b"),
          prompt: backupPrompt,
          temperature: 0.3,
          maxTokens: 1500,
        })

        // 清理AI响应中的标签内容
        const cleanedText = cleanResponse(text)

        // 保存到内存缓存
        newsCache[lang] = {
          summary: cleanedText,
          date: today,
          lastUpdated: new Date().toISOString(),
          newsCount: newsItems.length,
        }

        return NextResponse.json({
          summary: cleanedText,
          date: today,
          newsCount: newsItems.length,
          isBackup: true,
          fromCache: false,
        })
      } catch (backupError) {
        throw new Error(`Groq API错误: ${backupError}`)
      }
    }
  } catch (error) {
    console.error(`获取每日新闻错误 (${lang}):`, error)

    // 尝试从缓存获取数据作为后备
    if (newsCache[lang]) {
      return NextResponse.json({
        summary: newsCache[lang]!.summary,
        date: newsCache[lang]!.date,
        newsCount: newsCache[lang]!.newsCount,
        fromCache: true,
        warning: lang === "zh" ? "获取最新新闻失败，显示缓存内容" : "Failed to get latest news, showing cached content",
      })
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : lang === "zh" ? "获取新闻时出错" : "Error fetching news",
        fallbackSummary:
          lang === "zh"
            ? `
# 新西兰今日要闻

很抱歉，目前无法获取最新新闻。请稍后再试。

可能的原因：
- API连接问题
- 新闻源暂时不可用
- AI服务暂时中断

请刷新页面重试。
`
            : `
# New Zealand Today's Headlines

Sorry, we are currently unable to retrieve the latest news. Please try again later.

Possible reasons:
- API connection issues
- News sources temporarily unavailable
- AI service interruption

Please refresh the page to try again.
`,
        date: format(new Date(), "yyyy-MM-dd"),
      },
      { status: 200 },
    ) // 返回200状态码和fallback内容，而不是错误
  }
}
