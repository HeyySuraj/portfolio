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
  metadataBase: new URL("https://surajbhanarkar.vercel.app"),

  title: {
    default: "Suraj Bhanarkar | Full Stack Developer",
    template: "%s | Suraj Bhanarkar",
  },

  description:
    "Suraj Bhanarkar is a Full Stack Software Engineer with 2.5+ years of experience building scalable web applications using React, Next.js, Node.js, TypeScript, Express.js, and MongoDB.",

  keywords: [
    "Suraj Bhanarkar",
    "Full Stack Developer",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "TypeScript Developer",
    "MERN Stack Developer",
    "Software Engineer Portfolio",
  ],

  authors: [{ name: "Suraj Bhanarkar" }],
  creator: "Suraj Bhanarkar",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://surajbhanarkar.vercel.app",
    title: "Suraj Bhanarkar | Full Stack Developer",
    description:
      "Portfolio of Suraj Bhanarkar, a Full Stack Developer building modern web applications with React, Next.js, Node.js, and MongoDB.",
    siteName: "Suraj Bhanarkar Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Suraj Bhanarkar Portfolio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Suraj Bhanarkar | Full Stack Developer",
    description:
      "Full Stack Software Engineer specializing in React, Next.js, Node.js, and TypeScript.",
    creator: "@surajbhanarkar",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
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
