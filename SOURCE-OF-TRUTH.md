# Source of truth — Lough Signal / NI Economy Hub

*The one place that states what is actually live, where. Update this whenever the answer changes. Created to close the local/live drift identified in the Codex review.*

Last reconciled: 2026-08-24

---

## Production chain

| Layer | Value |
|---|---|
| GitHub repo | `github.com/TBell4035/ni-economy-hub` (public) |
| Production branch | `main` |
| Live production commit | `1a92246` (PR #3, "model-and-refresh") |
| Vercel team | `tbell4035's projects` (Hobby) |
| Vercel project | `ni-economy-hub` (`prj_LycNa0wndNA9n0d73TWCRF4kupGz`), GitHub-linked |
| Immutable rollback URL | `https://ni-economy-go2xgxpws-tbell4035s-projects.vercel.app` (deployment `dpl_FzWTon5CnRTDABzPvYDRURqbXvdV`) |

## Preservation baseline (v3, pre-Lough Signal)

Production commit `1a92246` is preserved three independent ways:
- Git tag: `ni-economy-hub-v3-pre-lough-signal`
- Git branch: `archive/ni-economy-hub-v3`
- Vercel immutable deployment URL (above)

Rollback = redeploy that commit / promote that Vercel deployment.

## Supabase projects — TWO exist; know which is which

| Project | ID | Region | Status | Role |
|---|---|---|---|---|
| **Lough Signal SaaS** | `kiwtvsvpfalekgzpclms` | EU (Frankfurt) | ACTIVE | **The business database.** organisation/contact/opportunity/engagement + compliance spine. All new work targets this. |
| Old Hub project | `nrsxdipcctxkfbcomjio` | (older) | Active but **EMPTY** | Legacy. `public` schema has no tables. The site's `lib/supabase.ts` fallback keys point here. **Decision pending: retire or migrate.** |

Consequence to remember: the live site's feedback form + intelligence feed point at the EMPTY old project, so those features are likely non-functional in production. Not a P0; a redesign item.

## Database schema — now versioned in the repo

Live schema on `kiwtvsvpfalekgzpclms` is captured as migration files under `supabase/migrations/`:
- `001_cut1_foundation.sql` — initial funnel schema (historical)
- `002_recentre_on_organisation.sql` — current shape: organisation → opportunity → engagement, + service (3 products seeded), + compliance spine (consent_event, wording_version, audit_log), all RLS deny-all

**Rule going forward (per Codex, agreed):** every database change is a numbered migration file committed here BEFORE or WHEN it is applied. No more dashboard-only SQL. These two files were reconstructed from the exact SQL applied on 2026-08-24 and represent what is live.

## Environment variables

Set in **Vercel** (Project → Settings → Environment Variables), never in git:
- `SUPABASE_URL` = `https://kiwtvsvpfalekgzpclms.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = (secret; server-only)
- `RESEND_API_KEY` = (rotated 2026-08; secret)
- `EMAIL_FROM` = `Lough Signal <noreply@loughsignal.co.uk>`
- `SITE_URL` = deployment URL

The old `lib/supabase.ts` in the repo hardcodes the OLD project's URL + anon key as fallbacks. These are publishable (browser-safe) keys, not secrets, and point at the empty project — low risk — but should move to env vars during the redesign.

## Lead-capture code

Written and included in this reconciliation bundle under `lead-capture/` (subscribe form, `/api/subscribe`, `/api/confirm`, confirmation page, server-side Supabase admin client, Resend email). Not yet committed to the repo at time of writing — landing it here closes that half of the drift. Needs `npm install resend`.

## Known state / open decisions

- [ ] Old empty Supabase project: retire or migrate its intended feedback/intelligence tables?
- [ ] `lib/supabase.ts` hardcoded fallbacks → move to env vars (redesign)
- [x] Disclosure fix (Catalyst → Lough Signal) — live (commits cfb09b5, 84bfe5a)
- [x] Version strings → all read `data/economic/meta.json` (`dataVersion`, `publicationLabel`) — branch `brand/hub-light-restyle`
- [ ] Incorporation + ICO registration — gate go-live (Thomas)

## Design system (branch `brand/hub-light-restyle`)

- `lib/tokens.ts` is the ONLY colour/type/spacing source for TSX. `app/globals.css` `:root` mirrors it for CSS — change both together.
- The thirteen per-page `const T = {...}` dark palettes are deleted. Pages `import { T } from '@/lib/tokens'`.
- Fonts self-hosted in `public/fonts/` (Newsreader, Inter Tight, JetBrains Mono; SIL OFL). No Google Fonts requests.
- Type floor: 14px prose, 12px for uppercase mono metadata only (guide carve-out, to add to v0.3).
- Theory tags are neutral ink chips; `THEORY_TAGS[*].color` in `lib/designSystem.ts` is now unused.
- Chart load animation disabled everywhere (guide bans load motion).

## Site structure (branch `brand/hub-pass-2`)

- `app/(site)/` — Lough Signal: `/` landing page (from approved mockup v3), `/privacy` (notice v1.0).
- `app/(hub)/` — NI Economy Hub: overview moved from `/` to `/hub`; every module URL unchanged (`/labour`, `/ai`, …).
- `app/api/contact` — landing enquiry form → organisation → contact → opportunity (source `lough_signal_site`). No email notification until an inbox exists.

## Launch gate — `lib/launch.ts`

All personal-data forms (landing enquiry, briefing sign-up, Hub feedback) are CLOSED unless
`NEXT_PUBLIC_FORMS_OPEN=true`. Closed = holding message in the UI and 403 from the API.
Open only when: Lough Signal Ltd incorporated · ICO registered · /privacy placeholders filled ·
loughsignal.co.uk verified in Resend. Set `SITE_URL` to the real domain at the same time.

## Correction

The legacy Supabase project (`nrsxdipcctxkfbcomjio`) is NOT empty: it holds `intelligence_feed`
(read by /intelligence) and `feedback`. Treat it as live.
