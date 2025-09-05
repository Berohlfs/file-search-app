// Next
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
// CSS
import "./globals.css"

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
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
