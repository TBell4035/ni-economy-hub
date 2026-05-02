import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type FeedbackEntry = {
  id?: string
  module: string
  name?: string
  organisation?: string
  comment: string
  data_challenge?: boolean
  chart_reference?: string
  created_at?: string
  status?: 'pending' | 'reviewed' | 'incorporated'
}

export type IntelligenceEntry = {
  id?: string
  source_id: string
  source_name: string
  source_quality: number
  alignment: 'confirms' | 'challenges' | 'extends' | 'unresolved'
  score?: number
  category?: 'Established' | 'Active Review' | 'Strategic Intelligence'
  title: string
  summary: string
  url: string
  published_date: string
  module_relevance: string[]
  created_at?: string
}