import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, SupabaseNotConfiguredError } from "@/lib/supabaseAdmin";
import { sendConfirmationEmail } from "@/lib/email";
import { formsOpen } from "@/lib/launch";

export const runtime = "nodejs";

// Minimal, dependency-free validation. Keeps the bundle lean per the
// "don't build what you don't need" principle.
function isEmail(v: unknown): v is string {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 254;
}
function str(v: unknown, max = 200): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length ? t.slice(0, max) : null;
}

export async function POST(req: NextRequest) {
  if (!formsOpen) {
    return NextResponse.json({ error: "Sign-up is not open yet." }, { status: 403 });
  }
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field. Bots do.
  // Silently succeed so the bot can't tell it was caught.
  if (str(body.company_website)) {
    return NextResponse.json({ ok: true });
  }

  const email = body.email;
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const name = str(body.name);
  const companyName = str(body.company_name);
  const marketingConsent = body.marketing_consent === true;
  const researchConsent = body.research_consent === true;
  const leadSource = str(body.lead_source) ?? "hub";
  const leadSourceDetail = str(body.lead_source_detail);

  // Marketing consent is required to receive the briefing (that's the point of
  // signing up). Research consent is genuinely optional.
  if (!marketingConsent) {
    return NextResponse.json(
      { error: "Please tick the box to confirm you'd like to receive the briefing." },
      { status: 400 }
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = req.headers.get("user-agent") ?? null;

  let admin;
  try {
    admin = getSupabaseAdmin();
  } catch (e) {
    if (e instanceof SupabaseNotConfiguredError) {
      console.error(e.message);
      return NextResponse.json({ ok: false, error: "Service temporarily unavailable." }, { status: 503 });
    }
    throw e;
  }

  // --- Look up the current wording versions to attach to consent events ---
  const { data: wordings, error: wErr } = await admin
    .from("wording_version")
    .select("id, kind")
    .eq("is_current", true)
    .in("kind", ["marketing_consent", "research_consent"]);

  if (wErr) {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
  const wordingId = (kind: string) => wordings?.find((w) => w.kind === kind)?.id ?? null;

  // --- Optionally create an organisation if a company name was given ---
  let organisationId: string | null = null;
  if (companyName) {
    const { data: org, error: oErr } = await admin
      .from("organisation")
      .insert({ name: companyName, source: leadSource })
      .select("id")
      .single();
    if (!oErr && org) organisationId = org.id;
  }

  // --- Create (or re-activate) the contact as pending double opt-in ---
  // Check for an existing live contact with this email first.
  const { data: existing } = await admin
    .from("contact")
    .select("id, confirm_status, confirm_token")
    .eq("email", email)
    .is("deleted_at", null)
    .maybeSingle();

  let contactId: string;
  let token: string;

  if (existing) {
    contactId = existing.id;
    token = existing.confirm_token;
    // If they're already confirmed, we still re-send confirmation on re-signup
    // rather than leak that the email exists. Update org link/name if new.
    if (organisationId) {
      await admin.from("contact").update({ organisation_id: organisationId }).eq("id", contactId);
    }
  } else {
    const { data: created, error: cErr } = await admin
      .from("contact")
      .insert({
        email,
        name,
        organisation_id: organisationId,
        relationship: "subscriber",
        lead_source: leadSource,
        lead_source_detail: leadSourceDetail,
        confirm_sent_at: new Date().toISOString(),
      })
      .select("id, confirm_token")
      .single();

    if (cErr || !created) {
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
    contactId = created.id;
    token = created.confirm_token;
  }

  // --- Record consent events (append-only) against exact wording ---
  const consentRows = [
    {
      contact_id: contactId,
      purpose: "marketing",
      action: "granted",
      wording_version_id: wordingId("marketing_consent"),
      source: "intake_form",
      ip_address: ip,
      user_agent: userAgent,
    },
  ];
  if (researchConsent) {
    consentRows.push({
      contact_id: contactId,
      purpose: "research",
      action: "granted",
      wording_version_id: wordingId("research_consent"),
      source: "intake_form",
      ip_address: ip,
      user_agent: userAgent,
    });
  }
  await admin.from("consent_event").insert(consentRows);

  // --- Send the double opt-in email ---
  try {
    await sendConfirmationEmail({ to: email, name, token });
  } catch {
    // Contact + consent are saved; email failed. Tell the user gently.
    return NextResponse.json(
      { ok: true, warn: "Saved, but we couldn't send the confirmation email. Please contact us." },
      { status: 200 }
    );
  }

  return NextResponse.json({ ok: true });
}
