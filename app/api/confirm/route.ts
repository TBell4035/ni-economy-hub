import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, SupabaseNotConfiguredError } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

// Completes double opt-in. The /confirm page calls this with the token from
// the email link. Only a 'pending' contact gets flipped to 'confirmed'.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ ok: false, error: "Missing token." }, { status: 400 });
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

  const { data: contact } = await admin
    .from("contact")
    .select("id, confirm_status")
    .eq("confirm_token", token)
    .is("deleted_at", null)
    .maybeSingle();

  if (!contact) {
    return NextResponse.json({ ok: false, error: "This link is not valid." }, { status: 404 });
  }

  if (contact.confirm_status === "confirmed") {
    return NextResponse.json({ ok: true, already: true });
  }

  const { error } = await admin
    .from("contact")
    .update({ confirm_status: "confirmed", confirmed_at: new Date().toISOString() })
    .eq("id", contact.id);

  if (error) {
    return NextResponse.json({ ok: false, error: "Could not confirm. Please try again." }, { status: 500 });
  }

  // Append to the audit log (accountability).
  await admin.from("audit_log").insert({
    actor: "system",
    action: "contact.confirmed",
    entity_type: "contact",
    entity_id: contact.id,
  });

  return NextResponse.json({ ok: true });
}
