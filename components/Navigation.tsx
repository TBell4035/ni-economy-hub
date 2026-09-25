'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import modulesConfig from '@/config/modules.json'
import meta from '@/data/economic/meta.json'
import ModuleIcon from '@/components/ModuleIcon'

const NAV_ITEMS = Object.entries(modulesConfig.modules)
  .sort((a, b) => a[1].order - b[1].order)
  .map(([id, config]) => ({ id, ...config }))

export default function Navigation() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const getHref = (id: string) => id === 'overview' ? '/' : `/${id}`
  const isActive = (id: string) => {
    if (id === 'overview') return pathname === '/'
    return pathname.startsWith(`/${id}`)
  }

  return (
    <nav
      style={{
        width: collapsed ? '52px' : '220px',
        flexShrink: 0,
        background: 'var(--bg1)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        overflow: 'hidden',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}
    >
      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 10px 16px' : '20px 20px 16px',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        {collapsed ? (
          <div style={{
            width: 32, height: 32,
            background: 'rgba(15,76,74,.08)',
            border: '1px solid rgba(15,76,74,.3)',
            borderRadius:0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--teal)', fontWeight: 700, fontSize: 14,
            fontFamily: 'var(--font-mono)',
          }}>NI</div>
        ) : (
          <>
            <div className="mono" style={{
              fontSize: 12, letterSpacing:'0.12em',
              color: 'var(--teal)', marginBottom: 4
            }}>
              NORTHERN IRELAND
            </div>
            <div style={{
              fontSize: 14, fontWeight: 700,
              color: 'var(--text0)'
            }}>
              Economy Hub
            </div>
            <div className="mono" style={{
              fontSize: 12, color: 'var(--text3)', marginTop: 2
            }}>
              {meta.dataVersion} · {meta.publicationLabel}
            </div>
          </>
        )}
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {NAV_ITEMS.map(item => {
          const active = isActive(item.id)
          const href = getHref(item.id)
          return (
            <Link
              key={item.id}
              href={href}
              style={{ textDecoration: 'none' }}
              aria-label={collapsed ? item.label : undefined}
              title={collapsed ? item.label : undefined}
              aria-current={active ? 'page' : undefined}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: collapsed ? '9px 14px' : '9px 20px',
                  background: active ? 'rgba(15,76,74,.08)' : 'transparent',
                  borderLeft: `2px solid ${active ? 'var(--teal)' : 'transparent'}`,
                  color: active ? 'var(--teal)' : 'var(--text2)',
                  cursor: 'pointer',
                  transition: 'all 0.12s',
                }}
              >
                <span style={{
                  display: 'inline-flex',
                  minWidth: 16,
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <ModuleIcon id={item.id} />
                </span>
                {!collapsed && (
                  <span style={{
                    fontSize: 14,
                    fontFamily: 'var(--font-sans)'
                  }}>
                    {item.label}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Collapse toggle */}
      <div style={{
        padding: '12px',
        borderTop: '1px solid var(--border)',
        flexShrink: 0
      }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text3)',
            width: '100%',
            padding: '6px',
            cursor: 'pointer',
            fontSize: 12,
            fontFamily: 'var(--font-mono)',
            borderRadius:0,
          }}
        >
          {collapsed ? '→' : '← Collapse'}
        </button>
      </div>
    </nav>
  )
}