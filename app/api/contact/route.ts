import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, SupabaseNotConfiguredError } from "@/lib/supabaseAdmin";
import { formsOpen } from "@/lib/launch";

export const runtime = "nodejs";

// Lough Signal enquiry form (landing page, #contact).
// Writes organisation -> contact -> opportunity, matching the consultancy
// schema (002_recentre_on_organisation). Lawful basis: steps prior to a
// contract / legitimate interest in responding to an enquiry — no marketing
// consent is implied or recorded, and the contact is not added to the briefing.
// Email notification is deliberately absent until a Lough Signal inbox exists.

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
    return NextResponse.json({ ok: false, error: "Enquiries are not open yet." }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Pretend success, store nothing.
  if (str(body.company_website)) return NextResponse.json({ ok: true });

  const name = str(body.name, 120);
  const org = str(body.organisation, 160);
  const email = body.email;
  const problem = str(body.problem, 4000);
  const sector = str(body.sector, 80);
  const timing = str(body.timing, 80);
  const serviceCode = str(body.service, 60);
  const location = str(body.location, 120);
  const budget = str(body.budget, 40);
  // Source attribution (no device storage): ?from= tag on internal CTAs + referrer host.
  const from = str(body.from, 60)?.replace(/[^a-z0-9_-]/gi, "") || null;
  const referrer = str(body.referrer, 120);

  if (!name || !org || !isEmail(email) || !problem || !timing) {
    return NextResponse.json(
      { ok: false, error: "Please add your name, organisation, email, the decision you're working on and a rough timing." },
      { status: 400 }
    );
  }

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

  const lower = email.trim().toLowerCase();

  // Existing live contact? Reuse it (email is unique among live contacts).
  const { data: existing } = await admin
    .from("contact")
    .select("id, organisation_id")
    .eq("email", lower)
    .is("deleted_at", null)
    .maybeSingle();

  let organisationId: string | null = existing?.organisation_id ?? null;

  if (!organisationId) {
    const { data: o, error: oErr } = await admin
      .from("organisation")
      .insert({ name: org, sector, location, source: "lough_signal_site" })
      .select("id")
      .single();
    if (oErr || !o) {
      console.error("organisation insert failed", oErr);
      return NextResponse.json({ ok: false, error: "Could not send just now. Please try again." }, { status: 500 });
    }
    organisationId = o.id;
  }

  let contactId: string | null = existing?.id ?? null;
  if (!contactId) {
    const { data: c, error: cErr } = await admin
      .from("contact")
      .insert({
        email: lower,
        name,
        organisation_id: organisationId,
        relationship: "prospect",
        lead_source: "lough_signal_site",
        lead_source_detail: ["contact_form", from && `from:${from}`, referrer && `ref:${referrer}`].filter(Boolean).join(" · "),
      })
      .select("id")
      .single();
    if (cErr || !c) {
      console.error("contact insert failed", cErr);
      return NextResponse.json({ ok: false, error: "Could not send just now. Please try again." }, { status: 500 });
    }
    contactId = c.id;
  } else if (!existing?.organisation_id) {
    await admin.from("contact").update({ organisation_id: organisationId }).eq("id", contactId);
  }

  // Link the stated service of interest to the service catalogue, if given.
  let serviceId: string | null = null;
  if (serviceCode && serviceCode !== "grants") {
    const { data: svc } = await admin.from("service").select("id").eq("code", serviceCode).maybeSingle();
    serviceId = svc?.id ?? null;
  }

  const { error: pErr } = await admin.from("opportunity").insert({
    organisation_id: organisationId,
    primary_contact_id: contactId,
    title: `Website enquiry — ${org}`,
    problem,
    service_id: serviceId,
    // No dedicated columns yet for these; kept structured and greppable.
    trigger: [`Timing: ${timing}`, budget && `Budget: ${budget}`, serviceCode === "grants" && "Interest: funding bid", referrer && `Referrer: ${referrer}`]
      .filter(Boolean).join(" · "),
    // Source per CTA so enquiries can be counted by where they came from.
    source: from ? `lough_signal_site:${from}` : "lough_signal_site",
    status: "new",
  });
  if (pErr) {
    console.error("opportunity insert failed", pErr);
    return NextResponse.json({ ok: false, error: "Could not send just now. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
