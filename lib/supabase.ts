import { createClient } from '@supabase/supabase-js'
 
// Public project values used as fallbacks so the build never fails when the
// NEXT_PUBLIC_* env vars aren't set in a given environment (e.g. Vercel Preview).
// The anon key is a public, RLS-protected key designed to ship to the browser.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nrsxdipcctxkfbcomjio.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yc3hkaXBjY3R4a2ZiY29tamlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2Njg5MTcsImV4cCI6MjA5MzI0NDkxN30.hQ1xBRkaWdnCOoVpz4d9ee_OFB7aT2DRTOr321_mXnI'
 
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
