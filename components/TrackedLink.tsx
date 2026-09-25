'use client'
import { trackEvent } from '@/lib/track'

// An ordinary link that records a cookieless 'cta_click' event.
export default function TrackedLink({
  href, cta, className, style, children,
}: { href: string; cta: string; className?: string; style?: React.CSSProperties; children: React.ReactNode }) {
  return (
    <a href={href} className={className} style={style} onClick={() => trackEvent('cta_click', { cta })}>
      {children}
    </a>
  )
}
