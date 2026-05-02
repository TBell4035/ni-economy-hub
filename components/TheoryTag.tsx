'use client'
import { useState } from 'react'
import { THEORY_TAGS, type TheoryTagKey } from '@/lib/designSystem'
import sources from '@/data/sources.json'

interface Props {
  tag: TheoryTagKey
}

export default function TheoryTag({ tag }: Props) {
  const [open, setOpen] = useState(false)
  const config = THEORY_TAGS[tag]
  const source = sources.find(s => s.id === config.sourceId)

  return (
    <>
      <button
        className="theory-tag mono"
        onClick={() => setOpen(true)}
        style={{
          background: `${config.color}18`,
          border: `1px solid ${config.color}55`,
          color: config.color,
          fontSize: '9px',
          letterSpacing: '1.5px',
          padding: '2px 7px',
          borderRadius: '2px',
          textTransform: 'uppercase',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
        }}
        title="Click for theoretical context"
      >
        ◆ {config.label}
      </button>

      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg2)',
              border: `1px solid ${config.color}44`,
              borderTop: `3px solid ${config.color}`,
              borderRadius: '6px',
              padding: '24px 28px',
              maxWidth: '520px',
              width: '100%',
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: '9px',
                letterSpacing: '2px',
                color: config.color,
                marginBottom: '10px',
                textTransform: 'uppercase'
              }}
            >
              ◆ Theoretical Framework
            </div>
            <div style={{
              fontSize: '15px',
              fontWeight: 700,
              color: 'var(--text0)',
              marginBottom: '14px'
            }}>
              {config.label}
            </div>
            <p style={{
              fontSize: '13px',
              color: 'var(--text1)',
              lineHeight: '1.7',
              marginBottom: '18px'
            }}>
              {config.explainer}
            </p>
            {source && (
              <a                
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  color: config.color,
                  fontFamily: 'monospace',
                  textDecoration: 'none',
                  borderBottom: `1px solid ${config.color}44`,
                  paddingBottom: '2px',
                }}
              >
                ↗ {config.sourceLabel}
              </a>
            )}
            <button
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                marginTop: '18px',
                fontSize: '10px',
                color: 'var(--text3)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'monospace',
                letterSpacing: '1px',
              }}
            >
              × CLOSE
            </button>
          </div>
        </div>
      )}
    </>
  )
}