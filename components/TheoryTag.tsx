'use client'
import { useEffect, useRef, useState } from 'react'
import { THEORY_TAGS, type TheoryTagKey } from '@/lib/designSystem'
import { tokens } from '@/lib/tokens'
import sources from '@/data/sources.json'

// Theory tags are NEUTRAL ink chips. The eight bespoke theory colours in
// lib/designSystem.ts are deliberately ignored here: they broke the guide's
// six-colour ordered palette. The differentiator is naming Solow or
// hysteresis on the page, not the colour. (Decision for guide v0.3.)

export default function TheoryTag({ tag }: { tag: TheoryTagKey }) {
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const config = THEORY_TAGS[tag]
  const source = sources.find(s => s.id === config.sourceId)
  const titleId = `theory-${tag}-title`

  useEffect(() => {
    if (!open) return
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const close = () => { setOpen(false); trigger.current?.focus() }

  return (
    <>
      <button
        ref={trigger}
        className="theory-tag mono"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        style={{
          background: 'transparent',
          border: `1px solid ${tokens.ruleStrong}`,
          color: tokens.ink,
          fontSize: tokens.metaMin,
          letterSpacing: '0.08em',
          padding: '4px 10px',
          borderRadius: tokens.rPill,
          textTransform: 'uppercase',
          cursor: 'pointer',
        }}
      >
        {config.label}
      </button>

      {open && (
        <div className="modal-backdrop" onClick={close}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={e => e.stopPropagation()}
            style={{
              background: tokens.paper,
              border: `1px solid ${tokens.rule}`,
              borderTop: `2px solid ${tokens.ochre}`,
              padding: '28px 32px',
              maxWidth: 560,
              width: '100%',
            }}
          >
            <div className="mono" style={{ fontSize: tokens.metaMin, letterSpacing: '0.12em', color: tokens.ochre, marginBottom: 10, textTransform: 'uppercase' }}>
              Theoretical framework
            </div>
            <h2 id={titleId} style={{ fontFamily: tokens.fontDisplay, fontWeight: 400, fontSize: 28, lineHeight: 1.15, color: tokens.ink, margin: '0 0 14px' }}>
              {config.label}
            </h2>
            <p style={{ fontSize: 16, color: tokens.ink, lineHeight: 1.6, marginBottom: 18, maxWidth: tokens.reading }}>
              {config.explainer}
            </p>
            {source && (
              <a href={source.url} target="_blank" rel="noopener noreferrer"
                 style={{ fontSize: tokens.textMin, color: tokens.teal, textDecoration: 'underline', textUnderlineOffset: 3 }}>
                Source: {config.sourceLabel}
              </a>
            )}
            <button ref={closeBtn} onClick={close}
              style={{ display: 'block', marginTop: 22, fontSize: tokens.textMin, color: tokens.ink, background: 'transparent',
                       border: `1px solid ${tokens.ruleStrong}`, borderRadius: tokens.r1, padding: '6px 14px', cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
