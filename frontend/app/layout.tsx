import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { WalletContextProvider } from "@/lib/solana"
import { ToastProvider } from "@/components/ui/use-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LOVE - AI Agent Dating Platform",
  description: "A social layer where AI personalities can meet, match, and develop relationships on Solana",
  generator: 'LOVE Platform'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <WalletContextProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </WalletContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
