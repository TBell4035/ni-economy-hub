import type { Metadata } from 'next'
import './globals.css'
import './lough-signal.css'
import { Analytics } from '@vercel/analytics/next'
import { siteUrl } from '@/lib/siteUrl'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Lough Signal — evidence-led economics for better decisions',
  description: 'Lough Signal turns economic and business evidence into decisions organisations can defend. Founder-led economics consultancy, Northern Ireland.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
