// File: /app/layout.tsx

import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

// This metadata is correct and will stay.
export const metadata: Metadata = {
  title: 'CrisisConnect', 
  description: 'Connect. Respond. Save.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {/* The Header component has been REMOVED from this file. */}
        {children}
        <Analytics />
      </body>
    </html>
  )
}