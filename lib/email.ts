import { Resend } from "resend";
import { siteUrl } from "@/lib/siteUrl";

const apiKey = process.env.RESEND_API_KEY;
const fromAddress =
  process.env.EMAIL_FROM ?? "Lough Signal <noreply@loughsignal.co.uk>";

// Lazily construct so a missing key fails at send-time with a clear message,
// not at import-time (keeps builds/previews from crashing before config).
function client() {
  if (!apiKey) throw new Error("Missing RESEND_API_KEY environment variable.");
  return new Resend(apiKey);
}

export async function sendConfirmationEmail(params: {
  to: string;
  name?: string | null;
  token: string;
}) {
  const { to, name, token } = params;
  const confirmUrl = `${siteUrl}/confirm?token=${token}`;
  const greeting = name ? `Hi ${name},` : "Hello,";

  const html = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#16191C;line-height:1.6">
    <p style="font-size:16px">${greeting}</p>
    <p style="font-size:16px">
      Thanks for signing up to the Lough Signal economic briefing. One quick step:
      please confirm your email so we know it's really you.
    </p>
    <p style="margin:28px 0">
      <a href="${confirmUrl}"
         style="background:#16191C;color:#F2EEE6;text-decoration:none;padding:12px 22px;border-radius:2px;font-size:15px;display:inline-block">
        Confirm my email
      </a>
    </p>
    <p style="font-size:14px;color:#565B60">
      If the button doesn't work, paste this link into your browser:<br>
      <a href="${confirmUrl}" style="color:#0F4C4A">${confirmUrl}</a>
    </p>
    <p style="font-size:14px;color:#565B60">
      If you didn't sign up, you can ignore this email — nothing further will happen.
    </p>
    <hr style="border:none;border-top:1px solid rgba(22,25,28,.12);margin:28px 0">
    <p style="font-size:12px;color:#63636A">
      NI Economy Hub is a Lough Signal product. Lough Signal Ltd.
    </p>
  </div>`;

  return client().emails.send({
    from: fromAddress,
    to,
    subject: "Confirm your email — Lough Signal briefing",
    html,
  });
}
