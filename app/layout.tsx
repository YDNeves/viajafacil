import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { Navbar } from "@/components/Navbar"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "ViajaFacil - Guia Turístico de Angola",
  description: "Descubra os melhores destinos, hotéis e experiências em Angola",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <Navbar />
          <main className="pt-16">{children}</main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
