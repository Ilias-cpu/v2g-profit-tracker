import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'V2G Tracker',
  description: 'Simulateur ROI Vehicle-to-Grid',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body style={{fontFamily: 'var(--font-inter), sans-serif', margin: 0}}>{children}</body>
    </html>
  )
}
