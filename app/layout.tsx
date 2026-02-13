import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { Providers } from "@/components/providers"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
  title: "ComputerHouse - Maison Tech | N1 en Algerie",
  description:
    "ComputerHouse, le leader de la vente de materiel informatique en Algerie. Laptops, composants PC, peripheriques, reseau et surveillance. Livraison vers 58 wilayas.",
  keywords: [
    "ComputerHouse",
    "informatique Algerie",
    "laptop",
    "PC gaming",
    "composants PC",
    "Alger",
  ],
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F0FF" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0614" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
