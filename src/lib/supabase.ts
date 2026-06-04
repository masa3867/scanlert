import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

/**
 * Supabase JS はベース URL のみ受け取る（`/rest/v1` は付けない）。
 * ダッシュボードからコピーした URL に `/rest/v1` が含まれていると Invalid path になる。
 */
export function normalizeSupabaseUrl(url: string): string {
  return url.trim().replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '')
}

export function getSupabase(): SupabaseClient {
  if (_client) return _client
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!rawUrl || !key) throw new Error('Supabase environment variables are not set.')
  const url = normalizeSupabaseUrl(rawUrl)
  _client = createClient(url, key)
  return _client
}
