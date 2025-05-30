"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Newspaper, RefreshCw, Loader2, AlertCircle, Clock } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLanguage } from "../i18n/language-provider"

export default function DailyNewsReporter() {
  const { language } = useLanguage()
  const [newsSummary, setNewsSummary] = useState<string | null>(null)
  const [newsDate, setNewsDate] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isFromCache, setIsFromCache] = useState(false)
  const [warning, setWarning] = useState<string | null>(null)

  const content = {
    title: {
      zh: "AI 新闻播报员",
      en: "AI News Reporter",
    },
    subtitle: {
      zh: "由AI整理的新西兰每日要闻",
      en: "Daily New Zealand news highlights curated by AI",
    },
    cardTitle: {
      zh: "新西兰今日要闻",
      en: "New Zealand Today's Headlines",
    },
    loading: {
      zh: "正在获取并分析最新新闻...",
      en: "Fetching and analyzing the latest news...",
    },
    waitMessage: {
      zh: "这可能需要一点时间，请耐心等待",
      en: "This may take a moment, please be patient",
    },
    noNews: {
      zh: "暂无新闻",
      en: "No news available",
    },
    updateInfo: {
      zh: "内容每12小时自动更新一次，您也可以点击刷新按钮手动更新",
      en: "Content updates automatically every 12 hours, you can also click the refresh button to update manually",
    },
    cacheNotice: {
      zh: "显示缓存内容 - 点击刷新按钮获取最新新闻",
      en: "Showing cached content - Click refresh to get the latest news",
    },
    justUpdated: {
      zh: "刚刚更新",
      en: "Just updated",
    },
    minutesAgo: {
      zh: "分钟前更新",
      en: "minutes ago",
    },
    hoursAgo: {
      zh: "小时前更新",
      en: "hours ago",
    },
    daysAgo: {
      zh: "天前更新",
      en: "days ago",
    },
    fetchError: {
      zh: "获取新闻失败",
      en: "Failed to fetch news",
    },
    genericError: {
      zh: "获取新闻时出错",
      en: "Error fetching news",
    },
  }

  // 获取新闻
  const fetchNews = async (force = false) => {
    setLoading(true)
    setError(null)
    setWarning(null)

    try {
      // 调用API获取新闻，添加force参数和language参数
      const url = `/api/daily-news?force=${force ? "true" : "false"}&lang=${language}`
      const response = await fetch(url, {
        // 添加缓存控制，确保不使用浏览器缓存
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error(content.fetchError[language])
      }

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        if (data.fallbackSummary) {
          setNewsSummary(data.fallbackSummary)
        }
      } else {
        setNewsSummary(data.summary)
        setNewsDate(data.date)
        setIsFromCache(data.fromCache || false)
        setError(null)

        if (data.warning) {
          setWarning(data.warning)
        }

        // 如果是强制更新或获取了新内容，更新本地存储中的上次更新时间
        if (force || !data.fromCache) {
          localStorage.setItem(`news_last_update_time_${language}`, new Date().getTime().toString())
          localStorage.setItem(`news_last_fetch_time_${language}`, new Date().getTime().toString())
        }
      }

      setLastUpdated(new Date())
    } catch (err) {
      console.error("获取新闻错误:", err)
      setError(err instanceof Error ? err.message : content.genericError[language])
    } finally {
      setLoading(false)
    }
  }

  // 手动刷新
  const handleRefresh = () => {
    fetchNews(true) // 强制更新
  }

  // 当语言变化时重新获取新闻
  useEffect(() => {
    // 检查本地存储中的上次更新时间
    const lastFetchTime = localStorage.getItem(`news_last_fetch_time_${language}`)
    const now = new Date().getTime()

    // 如果没有上次更新时间，或者距离上次更新已经过了至少1小时，才获取新闻
    if (!lastFetchTime || now - Number.parseInt(lastFetchTime) > 60 * 60 * 1000) {
      fetchNews()
      // 更新本地存储中的上次更新时间
      localStorage.setItem(`news_last_fetch_time_${language}`, now.toString())
    } else {
      // 否则直接从缓存加载
      setLoading(true)
      fetch(`/api/daily-news?lang=${language}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.summary) {
            setNewsSummary(data.summary)
            setNewsDate(data.date)
            setIsFromCache(true)
          }
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    }
  }, [language]) // 当语言变化时重新执行

  // 组件加载时设置检查更新的定时器
  useEffect(() => {
    // 每小时检查一次是否有更新
    const interval = setInterval(
      () => {
        const lastUpdateTime = localStorage.getItem(`news_last_update_time_${language}`)
        const now = new Date().getTime()

        // 如果距离上次更新已经过了至少12小时，才自动更新
        if (!lastUpdateTime || now - Number.parseInt(lastUpdateTime) > 12 * 60 * 60 * 1000) {
          fetchNews()
          localStorage.setItem(`news_last_update_time_${language}`, now.toString())
        }
      },
      60 * 60 * 1000,
    ) // 每小时检查一次

    return () => clearInterval(interval)
  }, [language]) // 当语言变化时重新设置定时器

  // 格式化最后更新时间
  const formatLastUpdated = () => {
    if (!lastUpdated) return ""

    const now = new Date()
    const diffMs = now.getTime() - lastUpdated.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return content.justUpdated[language]
    if (diffMins < 60) return `${diffMins} ${content.minutesAgo[language]}`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} ${content.hoursAgo[language]}`

    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} ${content.daysAgo[language]}`
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          {content.title[language]}
        </h2>
        <p className="text-muted-foreground mt-2">{content.subtitle[language]}</p>
      </div>

      <Card className="rounded-xl overflow-hidden shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-400 to-indigo-500 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Newspaper className="mr-2 h-5 w-5" />
              <span>{content.cardTitle[language]}</span>
              {loading && <Loader2 size={16} className="ml-2 animate-spin" />}
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/80">{formatLastUpdated()}</span>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-white hover:bg-white/20"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw size={18} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {error && !newsSummary && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {warning && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{warning}</AlertDescription>
            </Alert>
          )}

          {isFromCache && (
            <div className="flex items-center justify-center text-xs text-muted-foreground mb-4">
              <Clock className="h-3 w-3 mr-1" />
              <span>{content.cacheNotice[language]}</span>
            </div>
          )}

          {loading && !newsSummary ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-purple-500 mb-4" />
              <p className="text-muted-foreground">{content.loading[language]}</p>
              <p className="text-xs text-muted-foreground mt-2">{content.waitMessage[language]}</p>
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              {newsSummary ? (
                <ReactMarkdown>{newsSummary}</ReactMarkdown>
              ) : (
                <p className="text-center py-8 text-muted-foreground">{content.noNews[language]}</p>
              )}
            </div>
          )}
          {!loading && newsSummary && (
            <div className="text-xs text-muted-foreground text-center mt-4 border-t pt-2">
              <Clock className="inline-block h-3 w-3 mr-1" />
              <span>{content.updateInfo[language]}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
