import sources from '@/data/sources.json'
import { T } from '@/lib/tokens'


const MODULE_COLORS: Record<string,string> = {
  overview:T.teal, output:T.blue, labour:T.gold,
  trade:T.teal, fiscal:T.blue, productivity:T.gold,
  ai:T.c5, business:T.c3, scenarios:T.c4,
}

const MODULES_ORDER = ['overview','output','labour','trade','fiscal','productivity','ai','business','scenarios']

export default function SourcesPage() {
  const byModule = MODULES_ORDER.map(mod=>({
    mod,
    entries: sources.filter(s => s.modules.includes(mod))
  }))

  const allSources = sources

  return (
    <div style={{maxWidth:1100}}>
      <div style={{marginBottom:24}}>
        <div className="mono" style={{fontSize:12,letterSpacing:'0.12em',color:T.teal,marginBottom:6}}>
          MODULE 11 · SOURCES
        </div>
        <h1 style={{fontFamily:'var(--font-display)',lineHeight:1.1,fontSize:40,fontWeight:400,color:T.text0,marginBottom:10,letterSpacing:-0.4}}>
          Sources
        </h1>
        <p style={{fontSize:14,color:T.text2,maxWidth:720,lineHeight:1.7}}>
          Every data point in V3 is sourced. This bibliography lists all primary sources
          used across all modules. Organised by module and then alphabetically by organisation.
          Each entry contains: organisation / author(s), title, date, and URL only.
          For source confidence ratings and alignment assessments, see the Intelligence Feed.
        </p>
      </div>

      {/* All sources count */}
      <div style={{
        background:T.card,border:`1px solid ${T.border}`,
        borderTop:`2px solid ${T.teal}`,
        borderRadius:0,padding:'14px 18px',marginBottom:24,
        display:'flex',justifyContent:'space-between',alignItems:'center'
      }}>
        <div>
          <div className="mono" style={{fontSize:12,letterSpacing:'0.12em',color:T.text3,marginBottom:4}}>TOTAL SOURCES</div>
          <div style={{fontSize:22,fontWeight:700,color:T.text0}}>{allSources.length}</div>
        </div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {MODULES_ORDER.map(m=>(
            <a key={m} href={`#${m}`} style={{
              background:`${MODULE_COLORS[m]||T.teal}18`,
              border:`1px solid ${MODULE_COLORS[m]||T.teal}44`,
              color:MODULE_COLORS[m]||T.teal,
              padding:'3px 10px',borderRadius:0,
              fontSize:12,fontFamily:'var(--font-mono)',letterSpacing:'0.04em',
              textTransform:'uppercase',textDecoration:'none',
            }}>{m}</a>
          ))}
        </div>
      </div>

      {/* By module */}
      {byModule.map(({mod,entries})=>(
        <div key={mod} id={mod} style={{marginBottom:32}}>
          <div style={{
            borderLeft:`3px solid ${MODULE_COLORS[mod]||T.teal}`,
            paddingLeft:14,marginBottom:16
          }}>
            <div className="mono" style={{fontSize:12,letterSpacing:'0.12em',color:MODULE_COLORS[mod]||T.teal,marginBottom:2}}>
              MODULE
            </div>
            <div style={{fontSize:16,fontWeight:700,color:T.text0,textTransform:'capitalize'}}>
              {mod}
            </div>
            <div className="mono" style={{fontSize:12,color:T.text3,marginTop:2}}>
              {entries.length} source{entries.length!==1?'s':''}
            </div>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:1}}>
            {entries.map(s=>(
              <div key={s.id} style={{
                background:T.card,border:`1px solid ${T.border}`,
                padding:'12px 16px',
                display:'grid',
                gridTemplateColumns:'200px 1fr 90px 1fr',
                gap:16,
                alignItems:'start',
              }}>
                <div>
                  <div className="mono" style={{fontSize:12,color:T.text3,marginBottom:3,letterSpacing:0.5}}>
                    ORGANISATION
                  </div>
                  <div style={{fontSize:14,color:T.text1,fontWeight:600}}>{s.organisation}</div>
                  {'authors' in s && s.authors && (
                    <div style={{fontSize:12,color:T.text3,marginTop:2}}>{(s as any).authors}</div>
                  )}
                </div>
                <div>
                  <div className="mono" style={{fontSize:12,color:T.text3,marginBottom:3,letterSpacing:0.5}}>
                    TITLE
                  </div>
                  <div style={{fontSize:14,color:T.text0,lineHeight:1.4}}>{s.title}</div>
                </div>
                <div>
                  <div className="mono" style={{fontSize:12,color:T.text3,marginBottom:3,letterSpacing:0.5}}>
                    DATE
                  </div>
                  <div className="mono" style={{fontSize:12,color:T.text2}}>{s.date}</div>
                </div>
                <div>
                  <div className="mono" style={{fontSize:12,color:T.text3,marginBottom:3,letterSpacing:0.5}}>
                    URL
                  </div>
                  <a href={s.url} target="_blank" rel="noopener noreferrer"
                    style={{fontSize:12,color:T.teal,wordBreak:'break-all',lineHeight:1.4,textDecoration:'none'}}>
                    {s.url} ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{
        background:T.card,border:`1px solid ${T.border}`,
        borderRadius:0,padding:'14px 18px',marginTop:8,
        fontSize:12,color:T.text3,lineHeight:1.6,
      }}>
        <span className="mono" style={{fontSize:12,color:T.teal,marginRight:8,letterSpacing:'0.08em'}}>NOTE</span>
        This bibliography covers primary data sources only. Commentary, analysis and journalism cited
        in the Intelligence Feed module carries separate confidence ratings. Where sources report
        conflicting figures, both are cited in the relevant module with attribution. The most recently
        published authoritative figure is used as the primary reference throughout V3.
      </div>
    </div>
  )
}