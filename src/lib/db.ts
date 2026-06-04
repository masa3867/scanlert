import { getSupabase } from './supabase'
import type {
  TopicCard,
  TopicDetail,
  TopicStatus,
  TopicWatch,
  DeliverySettings,
  TopicsListResult,
  TopicCounts,
} from '@/types'
import { TOPICS_LIST_LIMIT } from './env'
import { usesSupabaseStorage, withDataSource, withSupabaseWrite, formatDataError } from './data-source'
import { timed } from './timing'
import * as mockData from './mock-data'

export { IS_PIPELINE_MODE_MOCK, IS_MOCK_MODE } from './env'
export { isSupabaseConfigured, usesSupabaseStorage } from './data-source'

const TOPIC_LIST_COLUMNS =
  'id, title, source_url, relevance_score, summary, status, watch_label, created_at'

export async function getTopicsList(options?: {
  q?: string
  status?: TopicStatus
}): Promise<TopicsListResult> {
  return timed('getTopicsList', async () => {
    const { data, warning } = await withDataSource(
      () => mockData.getTopicsList(options),
      async () => {
        const supabase = getSupabase()
        const [counts, topics] = await Promise.all([
          fetchTopicCounts(supabase, options?.q),
          fetchTopicList(supabase, options),
        ])
        return { topics, counts }
      },
      { fallbackToMockOnError: true },
    )
    return { ...data, warning }
  })
}

/** API 互換: 一覧トピックのみ返す */
export async function getTopics(q?: string): Promise<TopicCard[]> {
  const { topics } = await getTopicsList({ q })
  return topics
}

export async function getTopic(id: string): Promise<TopicDetail | null> {
  return timed('getTopic', async () => {
    const { data } = await withDataSource(
      () => mockData.getTopic(id),
      async () => {
        const supabase = getSupabase()
        const { data: row, error } = await supabase.from('topics').select('*').eq('id', id).single()
        if (error) throw error
        return row ? rowToTopic(row) : null
      },
      { fallbackToMockOnError: true },
    )
    return data
  })
}

export async function updateTopicStatus(id: string, status: TopicStatus): Promise<boolean> {
  if (!usesSupabaseStorage()) return mockData.updateTopicStatus(id, status)
  try {
    const supabase = getSupabase()
    const { error } = await supabase.from('topics').update({ status }).eq('id', id)
    return !error
  } catch {
    return false
  }
}

export async function getWatches(): Promise<{ watches: TopicWatch[]; warning?: string }> {
  return timed('getWatches', async () => {
    const { data, warning } = await withDataSource(
      () => ({ watches: mockData.getWatches() }),
      async () => {
        const supabase = getSupabase()
        const { data: rows, error } = await supabase.from('watches').select('*').order('created_at')
        if (error) throw error
        return { watches: (rows ?? []).map(rowToWatch) }
      },
      { fallbackToMockOnError: true },
    )
    return { watches: data.watches, warning }
  })
}

export async function updateWatch(id: string, patch: Partial<TopicWatch>): Promise<TopicWatch | null> {
  if (!usesSupabaseStorage()) return mockData.updateWatch(id, patch)
  try {
    const supabase = getSupabase()
    const dbPatch: Record<string, unknown> = {}
    if (patch.label !== undefined) dbPatch.label = patch.label
    if (patch.keywords !== undefined) dbPatch.keywords = patch.keywords
    if (patch.sourceUrls !== undefined) dbPatch.source_urls = patch.sourceUrls
    if (patch.enabled !== undefined) dbPatch.enabled = patch.enabled
    if (patch.scoreThreshold !== undefined) dbPatch.score_threshold = patch.scoreThreshold
    const { data, error } = await supabase.from('watches').update(dbPatch).eq('id', id).select().single()
    if (error) throw error
    return data ? rowToWatch(data) : null
  } catch {
    return null
  }
}

export async function createWatch(input: Omit<TopicWatch, 'id'>): Promise<TopicWatch> {
  if (!usesSupabaseStorage()) return mockData.createWatch(input)
  return withSupabaseWrite(async () => {
    const supabase = getSupabase()
    const { data, error } = await supabase.from('watches').insert({
      label: input.label,
      keywords: input.keywords,
      source_urls: input.sourceUrls,
      enabled: input.enabled,
      score_threshold: input.scoreThreshold,
    }).select().single()
    if (error) throw error
    return rowToWatch(data!)
  })
}

export async function deleteWatch(id: string): Promise<boolean> {
  if (!usesSupabaseStorage()) return mockData.deleteWatch(id)
  try {
    const supabase = getSupabase()
    const { error } = await supabase.from('watches').delete().eq('id', id)
    return !error
  } catch {
    return false
  }
}

export async function ingestTopic(topic: Omit<TopicDetail, 'id' | 'status'>): Promise<TopicDetail> {
  if (!usesSupabaseStorage()) return mockData.ingestTopic(topic as Parameters<typeof mockData.ingestTopic>[0])
  return withSupabaseWrite(async () => {
    const supabase = getSupabase()
    const { data, error } = await supabase.from('topics').insert({
      title: topic.title,
      source_url: topic.sourceUrl,
      relevance_score: topic.relevanceScore,
      summary: topic.summary,
      content_snippet: topic.contentSnippet,
      watch_label: topic.watchLabel,
      model: topic.model,
    }).select().single()
    if (error) throw error
    return rowToTopic(data!)
  })
}

export async function getDeliverySettings(): Promise<DeliverySettings & { warning?: string }> {
  return timed('getDeliverySettings', async () => {
    const { data, warning } = await withDataSource(
      () => mockData.MOCK_DELIVERY,
      async () => {
        const supabase = getSupabase()
        const { data: row, error } = await supabase
          .from('delivery_settings')
          .select('*')
          .eq('id', 'default')
          .single()
        if (error) throw error
        return {
          slackWebhookUrl: row?.slack_webhook_url ?? '',
          emailEnabled: false,
          emailAddress: '',
          notifyAbove: row?.notify_above ?? 70,
        }
      },
      { fallbackToMockOnError: true },
    )
    return warning ? { ...data, warning } : data
  })
}

export async function updateDeliverySettings(patch: Partial<DeliverySettings>): Promise<DeliverySettings> {
  if (!usesSupabaseStorage()) return { ...mockData.MOCK_DELIVERY, ...patch }
  return withSupabaseWrite(async () => {
    const supabase = getSupabase()
    const dbPatch: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (patch.slackWebhookUrl !== undefined) dbPatch.slack_webhook_url = patch.slackWebhookUrl
    if (patch.notifyAbove !== undefined) dbPatch.notify_above = patch.notifyAbove
    const { data, error } = await supabase
      .from('delivery_settings')
      .update(dbPatch)
      .eq('id', 'default')
      .select()
      .single()
    if (error) throw error
    return {
      slackWebhookUrl: data?.slack_webhook_url ?? '',
      emailEnabled: false,
      emailAddress: '',
      notifyAbove: data?.notify_above ?? 70,
    }
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = ReturnType<typeof getSupabase>

function applySearch<T extends { or: (filter: string) => T }>(query: T, q?: string): T {
  if (q) return query.or(`title.ilike.%${q}%,summary.ilike.%${q}%`)
  return query
}

async function fetchTopicCounts(supabase: SupabaseClient, q?: string): Promise<TopicCounts> {
  const countFor = async (status?: TopicStatus) => {
    let query = supabase.from('topics').select('*', { count: 'exact', head: true })
    if (status) query = query.eq('status', status)
    query = applySearch(query, q)
    const { count, error } = await query
    if (error) throw error
    return count ?? 0
  }

  const [all, newCount, read, dismissed] = await Promise.all([
    countFor(),
    countFor('new'),
    countFor('read'),
    countFor('dismissed'),
  ])
  return { all, new: newCount, read, dismissed }
}

async function fetchTopicList(
  supabase: SupabaseClient,
  options?: { q?: string; status?: TopicStatus },
): Promise<TopicCard[]> {
  let query = supabase
    .from('topics')
    .select(TOPIC_LIST_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(TOPICS_LIST_LIMIT)

  if (options?.status) query = query.eq('status', options.status)
  query = applySearch(query, options?.q)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []).map(rowToTopicCard)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToTopicCard(row: any): TopicCard {
  return {
    id: row.id,
    title: row.title,
    sourceUrl: row.source_url,
    relevanceScore: row.relevance_score,
    summary: row.summary,
    status: row.status,
    watchLabel: row.watch_label,
    createdAt: row.created_at,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToTopic(row: any): TopicDetail {
  return {
    ...rowToTopicCard(row),
    contentSnippet: row.content_snippet ?? '',
    model: row.model,
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
