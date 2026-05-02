import sources from '@/data/sources.json'

const T = {
  bg0:'#07090d',bg1:'#0d1117',bg2:'#131920',bg3:'#192230',
  card:'#0f1620',border:'#1e2d3d',border2:'#243444',
  text0:'#eef2f7',text1:'#b8c8d8',text2:'#6a88a0',text3:'#3a5268',
  gold:'#e8a020',teal:'#12c4a4',blue:'#3a8fd4',
}

const MODULE_COLORS: Record<string,string> = {
  overview:T.teal, output:T.blue, labour:T.gold,
  trade:T.teal, fiscal:T.blue, productivity:T.gold,
  ai:'#9a70d4', business:'#e89020', scenarios:'#d45090',
}

const MODULES_ORDER = ['overview','output','labour','trade','fiscal','productivity','ai','business','scenarios']

export default function SourcesPage() {
  const byModule = MODULES_ORDER.map(mod=>({
    mod,
    entries: sources.filter(s => s.modules.includes(mod))
  }))

  const allSources = sources

  return (
    <div style={{maxWidth:1100}} className="page-enter">
      <div style={{marginBottom:24}}>
        <div className="mono" style={{fontSize:9,letterSpacing:3,color:T.teal,marginBottom:6}}>
          MODULE 11 · SOURCES
        </div>
        <h1 style={{fontSize:26,fontWeight:800,color:T.text0,marginBottom:10,letterSpacing:-0.5}}>
          Sources
        </h1>
        <p style={{fontSize:13,color:T.text2,maxWidth:720,lineHeight:1.7}}>
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
        borderRadius:6,padding:'14px 18px',marginBottom:24,
        display:'flex',justifyContent:'space-between',alignItems:'center'
      }}>
        <div>
          <div className="mono" style={{fontSize:9,letterSpacing:3,color:T.text3,marginBottom:4}}>TOTAL SOURCES</div>
          <div style={{fontSize:22,fontWeight:700,color:T.text0}}>{allSources.length}</div>
        </div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {MODULES_ORDER.map(m=>(
            <a key={m} href={`#${m}`} style={{
              background:`${MODULE_COLORS[m]||T.teal}18`,
              border:`1px solid ${MODULE_COLORS[m]||T.teal}44`,
              color:MODULE_COLORS[m]||T.teal,
              padding:'3px 10px',borderRadius:2,
              fontSize:9,fontFamily:'monospace',letterSpacing:1,
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
            <div className="mono" style={{fontSize:9,letterSpacing:3,color:MODULE_COLORS[mod]||T.teal,marginBottom:2}}>
              MODULE
            </div>
            <div style={{fontSize:16,fontWeight:700,color:T.text0,textTransform:'capitalize'}}>
              {mod}
            </div>
            <div className="mono" style={{fontSize:9,color:T.text3,marginTop:2}}>
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
                  <div className="mono" style={{fontSize:9,color:T.text3,marginBottom:3,letterSpacing:0.5}}>
                    ORGANISATION
                  </div>
                  <div style={{fontSize:12,color:T.text1,fontWeight:600}}>{s.organisation}</div>
                  {'authors' in s && s.authors && (
                    <div style={{fontSize:11,color:T.text3,marginTop:2}}>{(s as any).authors}</div>
                  )}
                </div>
                <div>
                  <div className="mono" style={{fontSize:9,color:T.text3,marginBottom:3,letterSpacing:0.5}}>
                    TITLE
                  </div>
                  <div style={{fontSize:12,color:T.text0,lineHeight:1.4}}>{s.title}</div>
                </div>
                <div>
                  <div className="mono" style={{fontSize:9,color:T.text3,marginBottom:3,letterSpacing:0.5}}>
                    DATE
                  </div>
                  <div className="mono" style={{fontSize:11,color:T.text2}}>{s.date}</div>
                </div>
                <div>
                  <div className="mono" style={{fontSize:9,color:T.text3,marginBottom:3,letterSpacing:0.5}}>
                    URL
                  </div>
                  <a href={s.url} target="_blank" rel="noopener noreferrer"
                    style={{fontSize:11,color:T.teal,wordBreak:'break-all',lineHeight:1.4,textDecoration:'none'}}>
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
        borderRadius:6,padding:'14px 18px',marginTop:8,
        fontSize:11,color:T.text3,lineHeight:1.6,
      }}>
        <span className="mono" style={{fontSize:9,color:T.teal,marginRight:8,letterSpacing:2}}>NOTE</span>
        This bibliography covers primary data sources only. Commentary, analysis and journalism cited
        in the Intelligence Feed module carries separate confidence ratings. Where sources report
        conflicting figures, both are cited in the relevant module with attribution. The most recently
        published authoritative figure is used as the primary reference throughout V3.
      </div>
    </div>
  )
}