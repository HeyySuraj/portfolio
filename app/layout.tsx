import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "Suraj Bhanarkar - Software Engineer",
  description:
    "Software Engineer specializing in full-stack development, creating accessible and performant web applications.",
  keywords: ["Software Engineer", "Full Stack Developer", "React", "Node.js", "TypeScript", "Web Development"],
  authors: [{ name: "Suraj Bhanarkar" }],
  creator: "Suraj Bhanarkar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://surajbhanarkar.dev",
    title: "Suraj Bhanarkar - Software Engineer",
    description:
      "Software Engineer specializing in full-stack development, creating accessible and performant web applications.",
    siteName: "Suraj Bhanarkar Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Suraj Bhanarkar - Software Engineer",
    description:
      "Software Engineer specializing in full-stack development, creating accessible and performant web applications.",
    creator: "@surajbhanarkar",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
