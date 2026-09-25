'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import modulesConfig from '@/config/modules.json'
import meta from '@/data/economic/meta.json'

export default function TopBar() {
  const pathname = usePathname()
  const seg = pathname.split('/')[1]
  const moduleId = !seg || seg === 'hub' ? 'overview' : seg
  const moduleConfig = modulesConfig.modules[moduleId as keyof typeof modulesConfig.modules]

  return (
    <div className="hub-topbar" style={{
      background: 'var(--bone)',
      borderBottom: '1px solid var(--border)',
      padding: '10px 28px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      position: 'sticky',
      top: 0,
      zIndex: 10,
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <button
          type="button"
          className="hub-menu-btn"
          aria-controls="hub-nav"
          onClick={() => window.dispatchEvent(new Event('hub-nav-toggle'))}
        >
          <Menu size={18} strokeWidth={1.5} aria-hidden="true" />
          <span>Menu</span>
        </button>
        <div className="mono hub-topbar-label" style={{ fontSize: 12, color: 'var(--text3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {moduleConfig?.label?.toUpperCase()}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexShrink: 0 }}>
        <span className="mono hub-topbar-version" style={{ fontSize: 12, color: 'var(--text3)' }}>
          {meta.dataVersion} · {meta.publicationLabel}
        </span>
        <Link href="/" style={{ fontSize: 14, color: 'var(--ink)', textDecoration: 'none', borderBottom: '2px solid var(--ochre)', paddingBottom: 2, fontWeight: 500, whiteSpace: 'nowrap' }}>
          <span className="hub-cta-long">Work with Lough Signal</span>
          <span className="hub-cta-short">Lough Signal</span>
        </Link>
      </div>
    </div>
  )
}
