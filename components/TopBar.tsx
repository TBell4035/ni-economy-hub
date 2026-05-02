'use client'
import { usePathname } from 'next/navigation'
import modulesConfig from '@/config/modules.json'

export default function TopBar() {
  const pathname = usePathname()
  const moduleId = pathname === '/' ? 'overview' : pathname.split('/')[1]
  const moduleConfig = modulesConfig.modules[moduleId as keyof typeof modulesConfig.modules]

  return (
    <div style={{
      background: 'var(--bg1)',
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
      <div className="mono" style={{ fontSize: 10, color: 'var(--text3)' }}>
        {moduleConfig?.icon} {moduleConfig?.label?.toUpperCase()}
      </div>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <span className="mono" style={{ fontSize: 9, color: 'var(--text3)' }}>
          DATA: NIETS 2024 · NIABI 2024 · ELMS NOV 2025 · HMT CRA NOV 2025
        </span>
        <span className="mono" style={{ fontSize: 9, color: 'var(--green)' }}>
          ● LIVE
        </span>
      </div>
    </div>
  )
}