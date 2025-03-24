import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { CloudSyncProvider } from "@/components/cloud-sync-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NoteSync - Advanced Notepad",
  description: "A feature-rich notepad application with cloud sync, markdown support, and AI features",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <CloudSyncProvider>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
        </CloudSyncProvider>
      </body>
    </html>
  )
}

