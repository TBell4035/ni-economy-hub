import type { Metadata } from 'next'
import './globals.css'
import './lough-signal.css'
import { Analytics } from '@vercel/analytics/next'
import { siteUrl } from '@/lib/siteUrl'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Lough Signal — evidence-led economics for better decisions',
  description: 'Lough Signal turns economic and business evidence into decisions organisations can defend. Founder-led economics consultancy, Northern Ireland.',
  openGraph: {
    type: 'website',
    siteName: 'Lough Signal',
    locale: 'en_GB',
    title: 'Lough Signal — the evidence behind better decisions',
    description: 'Evidence-led economics for Northern Ireland organisations: market assessments, economic evidence briefs, funding cases and systems reviews.',
    images: [{ url: '/og-lough-signal.png', width: 1200, height: 630, alt: 'Lough Signal — the evidence behind better decisions' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-lough-signal.png'] },
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
