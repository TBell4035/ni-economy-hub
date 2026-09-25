import type { Metadata } from 'next'
import { formsOpen } from '@/lib/launch'

export const metadata: Metadata = {
  title: 'Privacy notice — Lough Signal',
  description: 'How Lough Signal and the NI Economy Hub handle personal data.',
}

// Privacy Notice v1.0 (drafted Aug 2026). Placeholders render visibly as
// "to be confirmed" until Lough Signal Ltd is incorporated and ICO-registered.
// Replace each <TBC> with the real value before setting NEXT_PUBLIC_FORMS_OPEN=true.
function TBC({ children }: { children: React.ReactNode }) {
  return <span className="tbc">{children}</span>
}

export default function PrivacyPage() {
  return (
    <section className="legal">
      <div className="wrap">
        <div className="doc">
          <p className="kicker">Privacy</p>
          <h1>Privacy notice</h1>
          <p className="ver">Version 1.0 · Lough Signal Ltd · last updated September 2026</p>

          {!formsOpen && (
            <div className="notice" role="note">
              <strong>Current status:</strong> Lough Signal is completing its company and
              data-protection registration. Until that is done, our sign-up and enquiry forms are
              closed and we are not collecting personal data through this website. Details marked
              as to be confirmed will be completed at that point.
            </div>
          )}

          <h2>1. Who we are</h2>
          <p>Lough Signal Ltd (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is the data controller for the personal data described in this notice. The NI Economy Hub is a Lough Signal product.</p>
          <ul>
            <li><strong>Company:</strong> Lough Signal Ltd, registered in Northern Ireland, company number <TBC>to be confirmed</TBC></li>
            <li><strong>Registered office:</strong> <TBC>to be confirmed</TBC></li>
            <li><strong>Data protection contact:</strong> <TBC>to be confirmed</TBC></li>
            <li><strong>ICO registration number:</strong> <TBC>to be confirmed</TBC></li>
          </ul>
          <p>If you have any question about how we use your data, contact us at the address above. You have the right to complain to the Information Commissioner&apos;s Office (ico.org.uk) at any time, though we would appreciate the chance to resolve it first.</p>

          <h2>2. What data we collect</h2>
          <p><strong>When you send us an enquiry:</strong> your name, organisation and email address, what you tell us about the decision or problem you are working on, and optionally your sector and timing.</p>
          <p><strong>When you sign up for the Lough Signal briefing:</strong> your email address (required); optionally your name, company name and job title; and, if you choose to answer them, short questions about your business and the topics you care about.</p>
          <p><strong>When you give feedback on the NI Economy Hub:</strong> your comment, and optionally your name and organisation.</p>
          <p><strong>Automatically:</strong> basic technical data needed to deliver and secure the site, such as your IP address at the point you submit a form (for security and to record consent). We do not set advertising or tracking cookies. If we use analytics, it is privacy-preserving and cookieless.</p>
          <p>We do not ask for special category data (such as health, ethnicity or political opinions). Please do not include it in free-text fields.</p>

          <h2>3. Why we use it, and our lawful basis</h2>
          <div className="tablewrap">
            <table>
              <thead><tr><th>What we do</th><th>Purpose</th><th>Lawful basis (UK GDPR)</th></tr></thead>
              <tbody>
                <tr><td>Reply to your enquiry and, if you wish, discuss or quote for work</td><td>Respond to you and take steps you have asked for</td><td>Steps prior to a contract (Art. 6(1)(b)) and our legitimate interest in responding (Art. 6(1)(f))</td></tr>
                <tr><td>Send you the briefing and occasional updates</td><td>Keep you informed and tell you about our services</td><td>Consent (Art. 6(1)(a)), confirmed by double opt-in — withdraw any time</td></tr>
                <tr><td>Use your answers to tailor what we send and improve our content</td><td>Research and product improvement</td><td>Consent (Art. 6(1)(a)) and our legitimate interest in improving the service (Art. 6(1)(f))</td></tr>
                <tr><td>Read and act on feedback about the Hub</td><td>Correct and improve our analysis</td><td>Legitimate interest (Art. 6(1)(f))</td></tr>
                <tr><td>Keep records of consent, and secure the site</td><td>Compliance and security</td><td>Legal obligation (Art. 6(1)(c)) and legitimate interest (Art. 6(1)(f))</td></tr>
              </tbody>
            </table>
          </div>
          <p>Sending an enquiry does not sign you up to anything. You are never required to give consent, and withdrawing it does not affect anything done lawfully beforehand.</p>

          <h2>4. Profiling and how we use AI</h2>
          <p><strong>Tailoring.</strong> If you sign up and tell us about your business, we use your answers — such as your sector, size and priorities — to decide which content is most relevant to you. This is profiling under UK GDPR, and we only do it with your consent.</p>
          <p><strong>AI assistance.</strong> We use AI tools, including Anthropic&apos;s Claude, to help draft and assemble reports and briefs from economic data and our own editorial direction. Every piece of content is reviewed and approved by a person at Lough Signal before it is published or sent. A person holds editorial responsibility for everything we publish.</p>
          <p><strong>No solely automated decisions.</strong> We do not make decisions about you that have legal or similarly significant effects using solely automated processing.</p>

          <h2>5. Who we share it with</h2>
          <p>We do not sell your data. We share it only with service providers that help us run the service, under contract and only as needed:</p>
          <ul>
            <li><strong>Supabase</strong> — database hosting (EU region)</li>
            <li><strong>Resend</strong> — sending email</li>
            <li><strong>Vercel</strong> — website hosting</li>
            <li><strong>Anthropic</strong> — AI assistance in drafting content; we do not put your personal data into content-drafting prompts beyond what is needed to tailor something you have asked for</li>
            <li><strong>Stripe</strong> — payment processing, only if and when you buy something from us</li>
          </ul>
          <p>Some of these providers may process data outside the UK. Where they do, the transfer is protected by appropriate safeguards, such as the UK International Data Transfer Agreement or an equivalent. Ask us for the current list at any time.</p>

          <h2>6. How long we keep it</h2>
          <ul>
            <li><strong>Enquiries:</strong> for as long as needed to respond and, if we work together, for the life of that relationship; otherwise deleted within <TBC>retention period to be confirmed</TBC>.</li>
            <li><strong>Briefing subscribers:</strong> while you are subscribed. If you unsubscribe, we keep only a minimal suppression record (your email, so we do not contact you again) and delete the rest within <TBC>retention period to be confirmed</TBC>.</li>
            <li><strong>Consent records:</strong> as long as needed to demonstrate compliance, even after you leave.</li>
            <li><strong>Customers:</strong> records required for tax and accounting are kept for six years, as UK law requires.</li>
          </ul>

          <h2>7. Your rights</h2>
          <p>You have the right to access your data, correct it, have it deleted, restrict or object to processing, withdraw consent, and receive your data in a portable format. To exercise any of these, contact us using the details in section 1. We will respond within one month.</p>
          <p>Every marketing email we send has a one-click unsubscribe link. Using it withdraws your marketing consent immediately.</p>

          <h2>8. Changes to this notice</h2>
          <p>If we change how we use your data, we will update this notice and, where the change is significant, tell you directly. Each version is dated and kept on record.</p>
        </div>
      </div>
    </section>
  )
}
