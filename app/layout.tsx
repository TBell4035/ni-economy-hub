import type { Metadata } from 'next'
import './globals.css'
import './lough-signal.css'

export const metadata: Metadata = {
  title: 'Lough Signal — evidence-led economics for better decisions',
  description: 'Lough Signal turns economic and business evidence into decisions organisations can defend. Founder-led economics consultancy, Northern Ireland.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  )
}
