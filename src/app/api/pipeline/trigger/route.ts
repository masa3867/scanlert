import { NextResponse } from 'next/server'
import { ingestTopic, IS_MOCK_MODE } from '@/lib/db'

export async function POST() {
  if (IS_MOCK_MODE) {
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
    return NextResponse.json({ message: 'Mock pipeline triggered', topic })
  }

  return NextResponse.json({ message: 'Pipeline runs automatically via Vercel Cron Jobs every hour.' })
}
