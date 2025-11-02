import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, Urbanist } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "../styles/globals.css"
import { AccessibilityToolbar } from "@/components/accessibility-toolbar"
import { ThemeProvider } from "@/components/theme-provider"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

export const metadata: Metadata = {
  title: "Karnan — AI Solar Verification",
  description: "AI-Powered Rooftop Solar Verification & Citizen Reward Platform",
  generator: "bon.app",
}

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  display: "swap",
})

export default async function RootLayout({
  children,
  params: { locale = 'en' }
}: Readonly<{
  children: React.ReactNode
  params: { locale?: string }
}>) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  
  return (
    <html lang={locale} className={`${spaceGrotesk.variable} ${urbanist.variable} antialiased`} suppressHydrationWarning>
      <body className="font-sans bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <a href="#main-content" className="skip-link">Skip to main content</a>
            <Suspense fallback={null}>{children}</Suspense>
            <AccessibilityToolbar />
            <Analytics />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}