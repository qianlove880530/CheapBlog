import { Suspense } from "react"
import TreeNavigation from "@/components/blog/tree-navigation"
import AiSummary from "@/components/blog/ai-summary"
import ContentDisplay from "@/components/blog/content-display"
import { Card } from "@/components/ui/card"

// 创建一个加载状态组件
function ContentSkeleton() {
  return (
    <Card className="rounded-xl p-6 shadow-lg border-teal-200">
      <div className="h-8 w-3/4 mb-6 bg-gray-200 animate-pulse rounded-md"></div>
      <div className="space-y-4">
        <div className="h-4 w-full bg-gray-200 animate-pulse rounded-md"></div>
        <div className="h-4 w-full bg-gray-200 animate-pulse rounded-md"></div>
        <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded-md"></div>
        <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded-md"></div>
        <div className="h-4 w-full bg-gray-200 animate-pulse rounded-md"></div>
      </div>
    </Card>
  )
}

// 创建一个加载状态组件
function SummarySkeleton() {
  return (
    <Card className="rounded-xl shadow-md">
      <div className="h-10 bg-gradient-to-r from-amber-100 to-teal-100 rounded-t-xl"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 w-full bg-gray-200 animate-pulse rounded-md"></div>
        <div className="h-8 w-full bg-gray-200 animate-pulse rounded-md"></div>
      </div>
    </Card>
  )
}

// 创建一个加载状态组件
function NavigationSkeleton() {
  return (
    <Card className="rounded-xl shadow-md p-4">
      <div className="h-6 w-1/2 mb-4 bg-gray-200 animate-pulse rounded-md"></div>
      <div className="space-y-3">
        <div className="h-4 w-full bg-gray-200 animate-pulse rounded-md"></div>
        <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded-md"></div>
        <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded-md"></div>
      </div>
    </Card>
  )
}

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Suspense fallback={<NavigationSkeleton />}>
            <TreeNavigation />
          </Suspense>
          <Suspense fallback={<SummarySkeleton />}>
            <AiSummary />
          </Suspense>
        </div>
        <div className="md:col-span-3">
          <Suspense fallback={<ContentSkeleton />}>
            <ContentDisplay />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
