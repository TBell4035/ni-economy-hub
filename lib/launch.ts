// Launch gate for anything that collects personal data.
//
// Forms stay CLOSED unless NEXT_PUBLIC_FORMS_OPEN is exactly "true" in the
// environment. Do not open them until all three are done (Sep 2026 plan):
//   1. Lough Signal Ltd incorporated (the named data controller exists)
//   2. ICO registration complete
//   3. /privacy placeholders filled (company no., registered office, ICO no., contact email)
// Also needed for the subscribe flow: loughsignal.co.uk verified in Resend.
//
// When closed: form UIs show a holding message and the API routes refuse
// submissions with 403, so nothing is stored even if someone posts directly.
export const formsOpen = process.env.NEXT_PUBLIC_FORMS_OPEN === 'true'
