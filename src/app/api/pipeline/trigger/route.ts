import { NextResponse } from 'next/server'
import { ingestTopic } from '@/lib/db'
import { IS_PIPELINE_MODE_MOCK } from '@/lib/env'
import { runPipeline } from '@/lib/pipeline'
import { revalidateDashboardPaths } from '@/lib/revalidate-dashboard'

export const maxDuration = 300

export async function POST() {
  if (IS_PIPELINE_MODE_MOCK) {
    const topic = await ingestTopic({
      title: `[デモ] 手動トリガーによるサンプルトピック — ${new Date().toLocaleTimeString('ja-JP')}`,
      sourceUrl: 'https://example.com/demo',
      contentSnippet: 'これはパイプライン手動トリガーのデモです。本番では Vercel Cron Jobs が RSS を収集し Claude で要約します。',
      relevanceScore: Math.floor(Math.random() * 40) + 60,
      summary: 'パイプライン手動トリガーのデモ実行。本番環境では Vercel Cron Jobs が毎時自動的に情報を収集・要約します。',
      watchLabel: 'AI・生成AI動向',
      model: 'mock',
      createdAt: new Date().toISOString(),
    })
    revalidateDashboardPaths(topic.id)
    return NextResponse.json({ processed: 1, ingested: 1, errors: 0 })
  }

  const result = await runPipeline()
  revalidateDashboardPaths()
  return NextResponse.json(result)
}
