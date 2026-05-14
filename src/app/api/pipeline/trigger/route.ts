import { NextResponse } from 'next/server'
import { ingestTopic, IS_MOCK_MODE } from '@/lib/mock-data'

export async function POST() {
  if (IS_MOCK_MODE) {
    const topic = ingestTopic({
      title: `[デモ] 手動トリガーによるサンプルトピック — ${new Date().toLocaleTimeString('ja-JP')}`,
      sourceUrl: 'https://example.com/demo',
      contentSnippet: 'これはパイプライン手動トリガーのデモです。本番では n8n が RSS/HTTP を収集し Claude で要約します。',
      relevanceScore: Math.floor(Math.random() * 40) + 60,
      summary: 'パイプライン手動トリガーのデモ実行。本番環境では n8n ワークフローが自動的に情報を収集・要約し、このエンドポイント経由で取り込まれます。',
      watchLabel: 'AI・生成AI動向',
      model: 'mock',
      createdAt: new Date().toISOString(),
    })
    return NextResponse.json({ message: 'Mock pipeline triggered', topic })
  }

  return NextResponse.json({ error: { code: 'NOT_IMPLEMENTED', message: 'Connect n8n or set PIPELINE_MODE=mock' } }, { status: 501 })
}
