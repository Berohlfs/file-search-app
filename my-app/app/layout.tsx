// Next
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
// CSS
import "./globals.css"
// Components
import { ThemeProvider } from "@/app/components/ThemeProvider"
// Shadcn
import { Toaster } from "@/components/ui/sonner"

const montserrat = Montserrat({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "File Search App",
  description: "This app allows users to upload documents and search inside their contents.",
}

type Props = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>

          {children}

          <Toaster />

        </ThemeProvider>
      </body>
    </html>
  )
}
