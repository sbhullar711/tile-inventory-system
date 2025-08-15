// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Tile {
  id: number
  name: string
  picture_url?: string
  size: string
  sqft_per_box: number
  total_boxes: number
  location?: string
  created_at: string
  updated_at: string
}