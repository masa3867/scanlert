import Anthropic from '@anthropic-ai/sdk'
import Parser from 'rss-parser'
import { getWatches, getDeliverySettings, ingestTopic } from '@/lib/db'

const client = new Anthropic()
const parser = new Parser()

export type PipelineResult = {
  processed: number
  ingested: number
  errors: number
}

export async function runPipeline(): Promise<PipelineResult> {
  const [{ watches }, delivery] = await Promise.all([getWatches(), getDeliverySettings()])
  const enabledWatches = watches.filter(w => w.enabled)

  let processed = 0
  let ingested = 0
  let errors = 0

  for (const watch of enabledWatches) {
    for (const feedUrl of watch.sourceUrls) {
      try {
        const feed = await parser.parseURL(feedUrl)
        for (const item of feed.items.slice(0, 20)) {
          const title = item.title ?? ''
          const snippet = item.contentSnippet ?? item.summary ?? ''
          const sourceUrl = item.link ?? feedUrl

          const matched = watch.keywords.some(kw =>
            title.includes(kw) || snippet.includes(kw)
          )
          if (!matched) continue

          processed++

          const message = await client.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 512,
            messages: [{
              role: 'user',
              content: `あなたはビジネスニュースのアナリストです。
以下の記事が監視キーワード「${watch.keywords.join('、')}」にどれほど関連しているか0-100でスコアリングし、日本語で3文以内の要約を生成してください。

タイトル: ${title}
本文抜粋: ${snippet.slice(0, 500)}

必ずJSON形式のみで返してください:
{"relevanceScore": 85, "summary": "要約テキスト"}`
            }]
          })

          const text = message.content[0].type === 'text' ? message.content[0].text : ''
          const jsonMatch = text.match(/\{[\s\S]*\}/)
          if (!jsonMatch) continue

          let parsed: { relevanceScore: number; summary: string }
          try {
            parsed = JSON.parse(jsonMatch[0])
          } catch {
            continue
          }

          if (parsed.relevanceScore < watch.scoreThreshold) continue

          const topic = await ingestTopic({
            title,
            sourceUrl,
            relevanceScore: parsed.relevanceScore,
            summary: parsed.summary,
            contentSnippet: snippet.slice(0, 500),
            watchLabel: watch.label,
            model: 'claude-haiku-4-5-20251001',
            createdAt: new Date().toISOString(),
          })
          ingested++

          if (parsed.relevanceScore >= delivery.notifyAbove && delivery.slackWebhookUrl) {
            await fetch(delivery.slackWebhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: `*[${watch.label}] スコア ${parsed.relevanceScore}* — ${topic.title}\n${parsed.summary}\n<${sourceUrl}|記事を見る>`,
              }),
            })
          }
        }
      } catch {
        errors++
      }
    }
  }

  return { processed, ingested, errors }
}
