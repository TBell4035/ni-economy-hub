// Canonical site URL for links in emails and server-side self-calls.
// Order: explicit SITE_URL (set this once the real domain is live) ->
// Vercel production URL (auto-provided) -> this deployment's URL -> local dev.
// Previously this fell back straight to localhost, so production confirmation
// emails linked to http://localhost:3000.
export const siteUrl: string =
  process.env.SITE_URL ??
  (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000')
