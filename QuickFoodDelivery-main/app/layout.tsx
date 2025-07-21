import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/context/cart-context" // Added import

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "QuickFood - Mandya's Best Food Delivery",
  description: "Order fresh, fast, and delicious food in Mandya, Karnataka.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>{children}</CartProvider> {/* Wrapped children with CartProvider */}
      </body>
    </html>
  )
}
