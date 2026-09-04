import Link from "next/link";

export const metadata = { title: "Confirming — Lough Signal" };

async function confirmToken(token: string, baseUrl: string) {
  try {
    const res = await fetch(`${baseUrl}/api/confirm?token=${encodeURIComponent(token)}`, {
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const baseUrl = process.env.SITE_URL ?? "http://localhost:3000";
  const ok = token ? await confirmToken(token, baseUrl) : false;

  return (
    <main className="ls-page">
      <div className="ls-card">
        {ok ? (
          <>
            <h1 className="ls-h2">You're confirmed</h1>
            <p className="ls-body">
              Thanks — your email is confirmed and you'll receive the next Lough
              Signal briefing. In the meantime, explore the NI Economy Hub.
            </p>
            <Link className="ls-button" href="/">Go to the Hub</Link>
          </>
        ) : (
          <>
            <h1 className="ls-h2">We couldn't confirm that link</h1>
            <p className="ls-body">
              The link may have expired or already been used. Try signing up again,
              and we'll send a fresh confirmation.
            </p>
            <Link className="ls-button" href="/subscribe">Sign up again</Link>
          </>
        )}
      </div>
    </main>
  );
}
