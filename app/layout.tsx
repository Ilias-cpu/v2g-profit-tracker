import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const font = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
})

export const metadata: Metadata = {
  title: 'V2G Profit Tracker – Simulateur ROI Vehicle-to-Grid',
  description:
    'Transformez les données de votre batterie en verdict financier immédiat. Calculez votre ROI V2G en moins de 30 secondes.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={font.variable}>
      <body className="font-sans bg-bg antialiased">{children}</body>
    </html>
  )
}
