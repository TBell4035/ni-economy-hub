// ============================================================================
// Lough Signal — design tokens. THE single source of colour, type and spacing.
// Source: Brand and Style Guide v0.2 (Aug 2026), §12, light palette.
//
// Replaces the thirteen per-page `const T = {...}` dark palettes. Pages import:
//     import { T } from '@/lib/tokens'
// `T` keeps the old key names (bg0, text1, gold…) so existing inline styles
// keep working; the VALUES are the light palette. Semantics invert on purpose:
// bg0 was near-black and is now bone; text0 was near-white and is now graphite.
// New code should use `tokens` (semantic names) rather than `T`.
// ============================================================================

export const tokens = {
  ink: '#16191C',        // graphite — primary text, rules, marks
  bone: '#F2EEE6',       // page background
  paper: '#FAF8F3',      // cards / lifted surfaces
  recess: '#EAE5DA',     // sunken surfaces

  ochre: '#8F5211',      // accent + wayfinding — sparingly
  ochreDark: '#C88A3A',  // ochre on dark sections only
  teal: '#0F4C4A',       // links, content, Hub product colour

  slate: '#565B60',      // secondary text
  mist: '#63636A',       // metadata, captions

  rule: 'rgba(22,25,28,.12)',
  ruleStrong: 'rgba(22,25,28,.24)',

  onInk: '#F2EEE6',
  onInk2: '#A8A8B2',
  ruleOnInk: 'rgba(242,239,230,.16)',

  // Status — insight / risk / opportunity / uncertainty
  insight: '#0F4C4A',
  risk: '#8C2F26',
  opportunity: '#2F5D3A',
  uncertain: '#63636A',

  // Chart palette — ordered, use in sequence. Series 1 is the subject (NI).
  c1: '#16191C', c2: '#0F4C4A', c3: '#8F5211',
  c4: '#8C2F26', c5: '#3E4A63', c6: '#7A7F6B',

  fontDisplay: '"Newsreader", Georgia, serif',
  fontSans: '"Inter Tight", system-ui, sans-serif',
  fontMono: '"JetBrains Mono", ui-monospace, monospace',

  // Type floors. Guide says 14px minimum on screen. Carve-out (decision logged
  // for v0.3 of the guide): uppercase, tracked, mono METADATA — eyebrows,
  // source strips, axis ticks — may go to 12px. Nothing else below 14px.
  metaMin: 12,
  textMin: 14,

  sp1: 4, sp2: 8, sp3: 12, sp4: 16, sp6: 24, sp8: 32, sp12: 48, sp16: 64, sp24: 96,
  r0: 0, r1: 2, rPill: 999,
  container: 1200, reading: 640,
  ease: 'cubic-bezier(.2,.6,.2,1)', durFast: '120ms', durBase: '220ms',
} as const

// Backwards-compatible map: old dark keys -> light values.
export const T = {
  ...tokens,
  bg0: tokens.bone, bg1: tokens.paper, bg2: tokens.recess, bg3: tokens.recess,
  card: tokens.paper,
  border: tokens.rule, border2: tokens.ruleStrong, borderStrong: tokens.ruleStrong,
  text0: tokens.ink, text1: tokens.ink, text2: tokens.slate, text3: tokens.mist,

  // Old accents -> the six-slot ordered palette. The old site used seven
  // bright hues decoratively; on bone they collapse onto brand roles.
  gold: tokens.ochre,
  amber: tokens.ochre,
  teal: tokens.teal,
  blue: tokens.c5,
  purple: tokens.c6,
  pink: tokens.risk,
  red: tokens.risk,
  green: tokens.opportunity,

} as const

export default tokens
