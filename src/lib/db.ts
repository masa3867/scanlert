import { getSupabase } from './supabase'
import type { TopicDetail, TopicStatus, TopicWatch, DeliverySettings } from '@/types'
import * as mockData from './mock-data'

export const IS_MOCK_MODE = !process.env.ANTHROPIC_API_KEY || process.env.PIPELINE_MODE === 'mock'

export async function getTopics(q?: string): Promise<TopicDetail[]> {
  if (IS_MOCK_MODE) return mockData.getTopics(q)
  const supabase = getSupabase()
  let query = supabase.from('topics').select('*').order('created_at', { ascending: false })
  if (q) query = query.or(`title.ilike.%${q}%,summary.ilike.%${q}%`)
  const { data } = await query
  return (data ?? []).map(rowToTopic)
}

export async function getTopic(id: string): Promise<TopicDetail | null> {
  if (IS_MOCK_MODE) return mockData.getTopic(id)
  const supabase = getSupabase()
  const { data } = await supabase.from('topics').select('*').eq('id', id).single()
  return data ? rowToTopic(data) : null
}

export async function updateTopicStatus(id: string, status: TopicStatus): Promise<boolean> {
  if (IS_MOCK_MODE) return mockData.updateTopicStatus(id, status)
  const supabase = getSupabase()
  const { error } = await supabase.from('topics').update({ status }).eq('id', id)
  return !error
}

export async function getWatches(): Promise<TopicWatch[]> {
  if (IS_MOCK_MODE) return mockData.getWatches()
  const supabase = getSupabase()
  const { data } = await supabase.from('watches').select('*').order('created_at')
  return (data ?? []).map(rowToWatch)
}

export async function updateWatch(id: string, patch: Partial<TopicWatch>): Promise<TopicWatch | null> {
  if (IS_MOCK_MODE) return mockData.updateWatch(id, patch)
  const supabase = getSupabase()
  const dbPatch: Record<string, unknown> = {}
  if (patch.label !== undefined) dbPatch.label = patch.label
  if (patch.keywords !== undefined) dbPatch.keywords = patch.keywords
  if (patch.sourceUrls !== undefined) dbPatch.source_urls = patch.sourceUrls
  if (patch.enabled !== undefined) dbPatch.enabled = patch.enabled
  if (patch.scoreThreshold !== undefined) dbPatch.score_threshold = patch.scoreThreshold
  const { data } = await supabase.from('watches').update(dbPatch).eq('id', id).select().single()
  return data ? rowToWatch(data) : null
}

export async function ingestTopic(topic: Omit<TopicDetail, 'id' | 'status'>): Promise<TopicDetail> {
  if (IS_MOCK_MODE) return mockData.ingestTopic(topic as Parameters<typeof mockData.ingestTopic>[0])
  const supabase = getSupabase()
  const { data } = await supabase.from('topics').insert({
    title: topic.title,
    source_url: topic.sourceUrl,
    relevance_score: topic.relevanceScore,
    summary: topic.summary,
    content_snippet: topic.contentSnippet,
    watch_label: topic.watchLabel,
    model: topic.model,
  }).select().single()
  return rowToTopic(data!)
}

export async function getDeliverySettings(): Promise<DeliverySettings> {
  if (IS_MOCK_MODE) return mockData.MOCK_DELIVERY
  const supabase = getSupabase()
  const { data } = await supabase.from('delivery_settings').select('*').eq('id', 'default').single()
  return {
    slackWebhookUrl: data?.slack_webhook_url ?? '',
    emailEnabled: false,
    emailAddress: '',
    notifyAbove: data?.notify_above ?? 70,
  }
}

export async function updateDeliverySettings(patch: Partial<DeliverySettings>): Promise<DeliverySettings> {
  if (IS_MOCK_MODE) return { ...mockData.MOCK_DELIVERY, ...patch }
  const supabase = getSupabase()
  const dbPatch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (patch.slackWebhookUrl !== undefined) dbPatch.slack_webhook_url = patch.slackWebhookUrl
  if (patch.notifyAbove !== undefined) dbPatch.notify_above = patch.notifyAbove
  const { data } = await supabase.from('delivery_settings').update(dbPatch).eq('id', 'default').select().single()
  return {
    slackWebhookUrl: data?.slack_webhook_url ?? '',
    emailEnabled: false,
    emailAddress: '',
    notifyAbove: data?.notify_above ?? 70,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToTopic(row: any): TopicDetail {
  return {
    id: row.id,
    title: row.title,
    sourceUrl: row.source_url,
    relevanceScore: row.relevance_score,
    summary: row.summary,
    contentSnippet: row.content_snippet,
    status: row.status,
    watchLabel: row.watch_label,
    model: row.model,
    createdAt: row.created_at,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToWatch(row: any): TopicWatch {
  return {
    id: row.id,
    label: row.label,
    keywords: row.keywords,
    sourceUrls: row.source_urls,
    enabled: row.enabled,
    scoreThreshold: row.score_threshold,
  }
}
