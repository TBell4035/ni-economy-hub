import type { IntelligenceEntry } from './supabase'

export function computeScore(
  quality: number,
  alignment: IntelligenceEntry['alignment']
): number {
  if (alignment === 'unresolved') return quality
  const multipliers = { confirms: 1, challenges: 2, extends: 3 }
  return quality * multipliers[alignment]
}

export function computeCategory(
  score: number,
  alignment: IntelligenceEntry['alignment']
): IntelligenceEntry['category'] {
  if (alignment === 'unresolved') return 'Active Review'
  if (score >= 11) return 'Strategic Intelligence'
  if (score >= 6)  return 'Active Review'
  return 'Established'
}

export const CATEGORY_CONFIG = {
  'Strategic Intelligence': {
    color: '#e8a020',
    description: 'High-quality sources significantly extending the model. Priority for incorporation.',
    borderColor: '#e8a02044'
  },
  'Active Review': {
    color: '#e05050',
    description: 'Credible sources challenging the model, or unresolved questions. Triggers module review.',
    borderColor: '#e0505044'
  },
  'Established': {
    color: '#38c070',
    description: 'Sources validating existing analysis. Low urgency for revision.',
    borderColor: '#38c07044'
  }
} as const