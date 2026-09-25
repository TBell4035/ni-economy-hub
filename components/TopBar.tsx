'use client'
import { usePathname } from 'next/navigation'
import modulesConfig from '@/config/modules.json'
import meta from '@/data/economic/meta.json'

export default function TopBar() {
  const pathname = usePathname()
  const moduleId = pathname === '/' ? 'overview' : pathname.split('/')[1]
  const moduleConfig = modulesConfig.modules[moduleId as keyof typeof modulesConfig.modules]

  return (
    <div style={{
      background: 'var(--bone)',
      borderBottom: '1px solid var(--border)',
      padding: '10px 28px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      flexShrink: 0,
    }}>
      <div className="mono" style={{ fontSize: 12, color: 'var(--text3)' }}>
        {moduleConfig?.label?.toUpperCase()}
      </div>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <span className="mono" style={{ fontSize: 12, color: 'var(--text3)' }}>
          {meta.dataVersion} · {meta.publicationLabel}
        </span>
      </div>
    </div>
  )
}