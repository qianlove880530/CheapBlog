import ProfileCard from "@/components/home/profile-card"
import ProjectShowcase from "@/components/home/product-showcase"
import DailyNewsReporter from "@/components/home/daily-news-reporter"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <ProfileCard />
      <ProjectShowcase />
      <DailyNewsReporter />
    </div>
  )
}
