import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/layout/navbar"
import WaveBackground from "@/components/layout/wave-background"
import { AIProvider } from "@/components/ai/ai-provider"
import { LanguageProvider } from "@/components/i18n/language-provider"
import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AI Matrix Blog",
  description: "A modern blog about AI and technology",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem themes={["light", "dark", "colorful"]}>
          <LanguageProvider>
            <AIProvider>
              <WaveBackground />
              <div className="min-h-screen flex flex-col relative z-0">
                <Navbar />
                <main className="flex-1">{children}</main>
              </div>
            </AIProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
