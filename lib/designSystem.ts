export const T = {
  bg0:     "#07090d",
  bg1:     "#0d1117",
  bg2:     "#131920",
  bg3:     "#192230",
  card:    "#0f1620",
  border:  "#1e2d3d",
  border2: "#243444",
  text0:   "#eef2f7",
  text1:   "#b8c8d8",
  text2:   "#6a88a0",
  text3:   "#3a5268",
  gold:    "#e8a020",
  teal:    "#12c4a4",
  blue:    "#3a8fd4",
  red:     "#e05050",
  green:   "#38c070",
  amber:   "#e89020",
  purple:  "#9a70d4",
  pink:    "#d45090",
} as const;

export const THEORY_TAGS = {
  solow: {
    label: "Solow Residual",
    color: "#12c4a4",
    explainer: "The Solow growth accounting framework decomposes economic growth into contributions from labour, capital, and Total Factor Productivity (TFP). The 'residual' — TFP — captures everything not explained by more workers or more machines: innovation, management quality, institutional effectiveness. NI's residual is persistently low.",
    sourceId: "NI_PRODUCTIVITY_2040",
    sourceLabel: "NI Productivity 2040, QUB / Productivity Institute (2025)"
  },
  hysteresis: {
    label: "Hysteresis",
    color: "#e89020",
    explainer: "Blanchard and Summers' hysteresis framework describes how temporary unemployment becomes permanent structural inactivity. Workers who exit the labour market during a downturn lose skills and employer confidence. NI's above-average economic inactivity is partly explained by hysteresis effects from the 2008–13 recession and the legacy of the Troubles, compounded by health system failures.",
    sourceId: "NISRA_LFS_2024",
    sourceLabel: "NISRA Labour Force Survey 2024; Blanchard & Summers (1986)"
  },
  barnett: {
    label: "Barnett Formula",
    color: "#e8a020",
    explainer: "The Barnett formula allocates changes in UK departmental spending to devolved administrations on a population-proportionate basis. NI (2.8% of England's population) receives 2.8p of every additional £1 spent by an English department on a comparable function. A needs-based top-up of 24% applies when NI's per-head funding falls below 124% of England's equivalent.",
    sourceId: "NIFC_BUDGET_2025_26",
    sourceLabel: "NI Fiscal Council Budget Assessment 2025-26"
  },
  gravity: {
    label: "Gravity Model",
    color: "#3a8fd4",
    explainer: "Gravity models predict bilateral trade flows as proportional to economic mass and inversely proportional to distance and transaction costs. NI's post-Protocol/Windsor Framework trade reorientation is a gravity model anomaly: N-S trade has grown 6.5x since 2015 as transaction costs with Ireland fell while GB-NI costs rose. Trade follows cost, not geography.",
    sourceId: "INTERTRADEIRELAND_2024",
    sourceLabel: "InterTradeIreland Trade Statistics 2024"
  },
  lse: {
    label: "Low Skills Equilibrium",
    color: "#e05050",
    explainer: "Finegold and Soskice's Low Skills Equilibrium (LSE) describes a self-reinforcing trap: firms have no incentive to demand higher skills if workers aren't qualified; workers have no incentive to train if firms don't require it. NI exhibits classic LSE characteristics — the largest skills gap in the UK, with 10.7% of adults lacking basic qualifications vs 6.9% UK average.",
    sourceId: "PRODUCTIVITY_DASHBOARD_2025",
    sourceLabel: "NI Productivity Dashboard 2025, QUB / Productivity Institute"
  },
  keynes: {
    label: "Keynesian AD",
    color: "#9a70d4",
    explainer: "Keynes's aggregate demand identity (Y = C + I + G + X-M) frames NI's fiscal vulnerability. With approximately 95% of Government spending (G) externally funded via the Block Grant, NI has almost no automatic fiscal stabilisers. A change in Westminster fiscal policy transmits directly to NI public services with no local buffer. The public sector multiplier for NI is estimated at 1.2–1.4.",
    sourceId: "NIFC_SR_RESPONSE_2025",
    sourceLabel: "NI Fiscal Council Spending Review Response 2025"
  },
  north: {
    label: "Institutional Economics",
    color: "#d45090",
    explainer: "Douglass North's institutional framework holds that economic performance is shaped by formal rules (laws, constitutions) and informal constraints (norms, trust, political culture). NI's economy carries measurable institutional costs: Executive collapse 2002–07, 2017–20, and 2022–24 accounts for approximately 40% of post-GFA governance time. QUB research estimates ~£2.3bn in cumulative lost capital investment during these periods.",
    sourceId: "NI_PRODUCTIVITY_2040",
    sourceLabel: "NI Productivity 2040; Brownlow G., QUB (2026)"
  },
  diffusion: {
    label: "Diffusion vs Invention",
    color: "#38c070",
    explainer: "A distinction from innovation economics: invention creates new technologies; diffusion spreads existing technologies across the economy. NI's enterprise policy is heavily biased toward invention — R&D grants, academic spin-outs, innovation clusters. But the proportion of innovation-active firms has fallen from 38% to 32% despite £232m in R&D grants. The productivity gap is a diffusion problem, not an invention problem.",
    sourceId: "NORTHSTAR_DIFFUSION_2025",
    sourceLabel: "NorthStar Briefing: Diffusion, Not Just Invention (Dec 2025)"
  }
} as const;

export type TheoryTagKey = keyof typeof THEORY_TAGS;

export const MODULE_STATUS_COLORS = {
  live: "#38c070",
  preview: "#e89020",
  building: "#3a8fd4",
} as const;