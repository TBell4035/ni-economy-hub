import {
  LayoutDashboard, TrendingUp, Users, ArrowLeftRight, PoundSterling, Gauge, Cpu,
  Building2, House, Rocket, GitBranch, Newspaper, Library, type LucideIcon,
} from 'lucide-react'

// One icon per Hub module. Replaces the text glyphs in config/modules.json
// (◉ ▲ ⊙ ⇌ …). Icons are always shown next to a visible label, or carry an
// accessible label when the rail is collapsed (brand guide: label-paired).
const ICONS: Record<string, LucideIcon> = {
  overview: LayoutDashboard,
  output: TrendingUp,
  labour: Users,
  trade: ArrowLeftRight,
  fiscal: PoundSterling,
  productivity: Gauge,
  ai: Cpu,
  business: Building2,
  housing: House,
  entrepreneurship: Rocket,
  scenarios: GitBranch,
  intelligence: Newspaper,
  sources: Library,
}

export default function ModuleIcon({ id, size = 16 }: { id: string; size?: number }) {
  const Icon = ICONS[id]
  if (!Icon) return null
  return <Icon size={size} strokeWidth={1.5} aria-hidden="true" focusable="false" />
}
