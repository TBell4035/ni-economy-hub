import Link from 'next/link'
import ContactForm from './ContactForm'

// Lough Signal landing page — from approved mockup v3 (Sep 2026).
export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <svg className="signal" viewBox="0 0 600 520" fill="none" aria-hidden="true">
          <g stroke="rgba(22,25,28,.10)" strokeWidth="1">
            <line x1="0" y1="130" x2="600" y2="130" /><line x1="0" y1="260" x2="600" y2="260" /><line x1="0" y1="390" x2="600" y2="390" />
          </g>
          <path d="M0,400 C60,380 90,410 140,360 C190,310 220,350 270,290 C320,230 360,270 410,200 C460,130 500,160 560,100 L600,80" stroke="#0F4C4A" strokeWidth="2" opacity="0.75" />
          <path d="M0,430 C60,420 110,438 160,410 C220,378 260,398 320,360 C380,322 420,342 480,305 C520,280 560,290 600,262" stroke="#8F5211" strokeWidth="1.5" opacity="0.6" strokeDasharray="4 5" />
          <g fill="#8F5211" opacity="0.9">
            <circle cx="140" cy="360" r="3.5" /><circle cx="270" cy="290" r="3.5" /><circle cx="410" cy="200" r="3.5" /><circle cx="560" cy="100" r="4" />
          </g>
        </svg>
        <div className="wrap">
          <p className="eyebrow">Evidence-led economics · Northern Ireland</p>
          <h1>The evidence behind <span className="accent">better decisions.</span></h1>
          <p className="lede"><strong>For organisations weighing an important decision</strong> — a new market, an investment, a funding bid, or a way of working that isn&apos;t keeping up. Lough Signal turns economic and business evidence into a clear, defensible basis for action, and helps you measure whether it worked.</p>
          <div className="actions">
            <a href="#contact" className="btn btn-primary">Describe the decision you&apos;re working on</a>
            <a href="#services" className="btn btn-ghost">What we do</a>
          </div>
        </div>
      </section>

      {/* SERVICES + SCOPE DIAGRAM */}
      <section id="services">
        <div className="wrap">
          <div className="sec-head">
            <p className="kicker">Services</p>
            <h2>One lens, three depths.</h2>
            <p>Lough Signal reads a decision from the outside in — the economy around you, the market you&apos;re in, and the way your own organisation runs. Each depth is a service you can start with. Together, they build the evidence behind a funding bid.</p>
          </div>
          <div className="scope">
            <div className="scope-visual">
              <svg viewBox="0 0 400 400" role="img" aria-label="Concentric scope diagram: your business at the centre, the market around it, the economy around that, all enclosed by a grants capability frame.">
                <rect x="8" y="8" width="384" height="384" rx="10" fill="none" stroke="#2F5D3A" strokeWidth="2" strokeDasharray="7 6" />
                <text x="24" y="34" fontFamily="'JetBrains Mono',monospace" fontSize="12" letterSpacing="1" fill="#2F5D3A">GRANTS · THE ASSEMBLED CASE</text>
                <circle cx="200" cy="214" r="168" fill="#0F4C4A" fillOpacity="0.06" stroke="#0F4C4A" strokeWidth="1.5" />
                <circle cx="200" cy="214" r="112" fill="#8F5211" fillOpacity="0.07" stroke="#8F5211" strokeWidth="1.5" />
                <circle cx="200" cy="214" r="56" fill="#16191C" />
                <text x="200" y="210" textAnchor="middle" fontFamily="'Newsreader',serif" fontSize="17" fill="#F2EEE6">Your</text>
                <text x="200" y="230" textAnchor="middle" fontFamily="'Newsreader',serif" fontSize="17" fill="#F2EEE6">business</text>
                <text x="200" y="122" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="12" letterSpacing="1" fill="#8F5211">MARKET</text>
                <text x="200" y="70" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="12" letterSpacing="1" fill="#0F4C4A">ECONOMY</text>
                <path d="M40,300 C110,280 150,250 200,214 C250,178 300,152 360,126" fill="none" stroke="rgba(22,25,28,.18)" strokeWidth="1" strokeDasharray="2 4" />
              </svg>
            </div>
            <ul className="scope-key">
              <li><span className="swatch" style={{ background: '#16191C' }} /><div><h4>Your business</h4><span className="layer">The core</span><p>How your organisation actually runs — processes, systems, data, reporting.</p></div></li>
              <li><span className="swatch" style={{ background: '#8F5211' }} /><div><h4>The market</h4><span className="layer">The middle ring</span><p>Your sector and opportunity — demand, competition, costs, the case for a move.</p></div></li>
              <li><span className="swatch" style={{ background: '#0F4C4A' }} /><div><h4>The economy</h4><span className="layer">The outer ring</span><p>The conditions around you — the evidence a decision has to stand up against.</p></div></li>
              <li><span className="frame-swatch" /><div><h4>Grants</h4><span className="layer">The enclosing frame</span><p>When a funding bid needs all three assembled into one defensible case.</p></div></li>
            </ul>
          </div>

          <div className="services">
            <div className="svc economy">
              <span className="clayer">Outer ring · Economy</span>
              <h3>Economic Evidence Brief</h3>
              <p className="q">&ldquo;What does the evidence say?&rdquo;</p>
              <p className="desc">A concise, source-backed analysis of a specific economic or market question — the grounding a board, funder or decision-maker needs before committing.</p>
              <div className="meta"><span>Concise brief</span><span className="price">£500–1,500</span></div>
              <a className="svc-cta" href="#contact">Discuss this type of question</a>
            </div>
            <div className="svc market">
              <span className="clayer">Middle ring · Market</span>
              <h3>Market Opportunity Snapshot</h3>
              <p className="q">&ldquo;Where are the opportunities?&rdquo;</p>
              <p className="desc">A substantial assessment of a market or expansion question: size, conditions, competition, costs, risks and the investment case.</p>
              <div className="meta"><span>Assessment</span><span className="price">£1,000–4,000</span></div>
              <a className="svc-cta" href="#contact">Discuss this type of question</a>
            </div>
            <div className="svc business">
              <span className="clayer">Core · Business</span>
              <h3>Data, Process &amp; Systems Review</h3>
              <p className="q">&ldquo;Can this be done better?&rdquo;</p>
              <p className="desc">An evidence-led review of how an organisation runs: workflows, systems, reporting, manual effort — and where data or automation could remove friction.</p>
              <div className="meta"><span>Audit + plan</span><span className="price">£1,500–4,000</span></div>
              <a className="svc-cta" href="#contact">Discuss this type of question</a>
            </div>
          </div>

          <div className="grants-line">
            <span className="gtag">Grants capability</span>
            <p><strong>Applying for funding?</strong> Combined, these become the evidence base behind a bid — business plan, financial model, economic impact and phased cash-flow. Recently: the full case behind a £700k regional development programme.</p>
            <a className="glink" href="#contact">Talk about a funding bid</a>
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section id="work" className="tone-paper">
        <div className="wrap">
          <div className="sec-head">
            <p className="kicker">How we work</p>
            <h2>Measure before. Change. Measure after.</h2>
            <p>The difference between advice and evidence is that evidence can be checked. Every engagement establishes where you are, recommends a change, and — where the work continues — measures what actually moved.</p>
          </div>
          <div className="process-grid">
            <ol className="steps">
              <li><span className="n" /><div><h4>Understand</h4><p>Get clear on the real decision and the constraints that are actually binding — not the ones assumed.</p></div></li>
              <li><span className="n" /><div><h4>Baseline</h4><p>Establish where things stand now, in evidence: the data, the position, the starting point you can measure against.</p></div></li>
              <li><span className="n" /><div><h4>Recommend</h4><p>A grounded, defensible recommendation — what to do, what it depends on, and where the risk sits.</p></div></li>
              <li><span className="n" /><div><h4>Transform</h4><p>Where the work continues: support putting the change in place, using the right mix of analysis, systems and automation.</p></div></li>
              <li><span className="n" /><div><h4>Measure</h4><p>Return to the baseline and measure what changed. Evidence of outcome, not just activity.</p></div></li>
            </ol>
            <aside className="example">
              <p className="tag">Worked example</p>
              <h4>The economic and financial case behind a £700k development programme.</h4>
              <p>A regional food-sector development programme needed a defensible case to secure grant funding. Lough Signal delivered the full evidence base underpinning the bid: business plan, financial model, economic impact assessment and phased cash-flow analysis across the project roll-out.</p>
              <div className="figures">
                <div className="fig"><div className="v">£200k</div><div className="l">GRANT SOUGHT</div></div>
                <div className="fig"><div className="v">£700k</div><div className="l">PROJECT ENVELOPE</div></div>
              </div>
              <p className="out">Delivered: the complete business and economic case underpinning a live funding proposal.</p>
            </aside>
          </div>
        </div>
      </section>

      {/* PROOF / HUB */}
      <section id="hub">
        <div className="wrap">
          <div className="sec-head">
            <p className="kicker">Proof over promises</p>
            <h2>See the standard of evidence.</h2>
            <p>Lough Signal maintains the NI Economy Hub — a public, source-transparent reading of the Northern Ireland economy. It&apos;s the clearest demonstration of how we work.</p>
          </div>
          <div className="proof-grid">
            <ul className="proof-list">
              <li><span><span className="lead">Source discipline —</span> every figure traceable to its origin, with official data distinguished from interpretation.</span></li>
              <li><span><span className="lead">NI-specific knowledge —</span> output, labour, trade, productivity and business, read together rather than in isolation.</span></li>
              <li><span><span className="lead">Interpretation —</span> not another chart portal, but what the evidence collectively means for organisations.</span></li>
            </ul>
            <div className="hubcard">
              <p className="label">A Lough Signal product</p>
              <h3>NI Economy Hub</h3>
              <p>Independent economic intelligence for Northern Ireland decision-makers. Official data, original analysis and transparent scenarios.</p>
              <Link href="/hub" className="btn btn-ghost">Explore the Hub</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section id="founder" className="tone-paper">
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: 40 }}><p className="kicker">Who you work with</p></div>
          <div className="founder founder-grid">
            <div>
              <p className="name">Thomas Bell</p>
              <p className="role">Founder · Economist</p>
            </div>
            <div>
              <p>Lough Signal is founder-led. You work directly with the economist doing the analysis — not a team you never meet.</p>
              <p>Thomas is an economist who has worked across academic, public and commercial economics, with experience supporting early-stage and scaling companies across Northern Ireland&apos;s innovation ecosystem.</p>
              <ul className="creds">
                <li><span className="k">Experience</span><span>Economist at Ulster University, InterTradeIreland and EY</span></li>
                <li><span className="k">Education</span><span>MSc Economics, Queen&apos;s University Belfast</span></li>
                <li><span className="k">Research</span><span>Five peer-reviewed articles published during time at Ulster University</span></li>
                <li><span className="k">Current</span><span>Developing the economic and financial case for a multi-year regional development programme</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact">
        <div className="wrap">
          <div className="contact-grid">
            <div className="sec-head" style={{ marginBottom: 0 }}>
              <p className="kicker">Start a conversation</p>
              <h2>Tell us the decision you&apos;re working on.</h2>
              <p>One conversation, an honest read on whether Lough Signal can help, and no commitment until it makes sense. The more specific the problem, the more useful the reply.</p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
