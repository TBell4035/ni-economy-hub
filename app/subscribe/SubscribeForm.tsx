"use client";

import { useState } from "react";

type State = "idle" | "submitting" | "done" | "error";

export default function SubscribeForm({ leadSource }: { leadSource?: string }) {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      email: data.get("email"),
      name: data.get("name") || null,
      company_name: data.get("company_name") || null,
      company_website: data.get("company_website") || null, // honeypot
      marketing_consent: data.get("marketing_consent") === "on",
      research_consent: data.get("research_consent") === "on",
      lead_source: leadSource ?? "hub",
    };

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Something went wrong. Please try again.");
        setState("error");
        return;
      }
      setState("done");
    } catch {
      setError("Something went wrong. Please try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="ls-card" role="status">
        <h2 className="ls-h2">Check your inbox</h2>
        <p className="ls-body">
          We've sent you a confirmation link. Click it to start receiving the
          briefing. If it doesn't arrive in a few minutes, check your spam folder.
        </p>
      </div>
    );
  }

  return (
    <form className="ls-card" onSubmit={onSubmit} noValidate>
      <h2 className="ls-h2">Get the Lough Signal briefing</h2>
      <p className="ls-body">
        Clear, evidence-led reading of the Northern Ireland economy — what the
        data actually says, and what it means for your organisation. Free.
      </p>

      <label className="ls-label" htmlFor="email">Email<span aria-hidden="true"> *</span></label>
      <input className="ls-input" id="email" name="email" type="email" required
             autoComplete="email" placeholder="you@company.com" />

      <label className="ls-label" htmlFor="name">Name</label>
      <input className="ls-input" id="name" name="name" type="text"
             autoComplete="name" placeholder="Optional" />

      <label className="ls-label" htmlFor="company_name">Organisation</label>
      <input className="ls-input" id="company_name" name="company_name" type="text"
             autoComplete="organization" placeholder="Optional" />

      {/* Honeypot: visually hidden, off-screen, not focusable. Bots fill it. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        <label htmlFor="company_website">Company website</label>
        <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="ls-check">
        <input type="checkbox" name="marketing_consent" />
        <span>
          I'd like to receive the monthly economic briefing and occasional updates
          from Lough Signal by email. I can unsubscribe anytime.
        </span>
      </label>

      <label className="ls-check">
        <input type="checkbox" name="research_consent" />
        <span>
          Optional: Lough Signal may use my responses to tailor content and improve
          its reports.
        </span>
      </label>

      {error && <p className="ls-error" role="alert">{error}</p>}

      <button className="ls-button" type="submit" disabled={state === "submitting"}>
        {state === "submitting" ? "Signing you up…" : "Sign up"}
      </button>

      <p className="ls-fine">
        We record your consent and handle your details as set out in our{" "}
        <a href="/privacy">Privacy Notice</a>. NI Economy Hub is a Lough Signal product.
      </p>
    </form>
  );
}
