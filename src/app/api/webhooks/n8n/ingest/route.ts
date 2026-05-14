import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { ingestTopic } from '@/lib/mock-data'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const ingestSchema = z.object({
  title: z.string().min(1),
  sourceUrl: z.string().url(),
  contentSnippet: z.string(),
  relevanceScore: z.number().min(0).max(100),
  summary: z.string(),
  watchLabel: z.string().optional(),
  model: z.string().optional(),
})

function verifyHmac(body: string, signature: string, secret: string): boolean {
  const expected = createHmac('sha256', secret).update(body).digest('hex')
  return `sha256=${expected}` === signature
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const secret = process.env.N8N_WEBHOOK_SECRET

  if (secret) {
    const sig = request.headers.get('x-n8n-signature') ?? ''
    if (!verifyHmac(body, sig, secret)) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Invalid signature' } }, { status: 401 })
    }
  }

  const parsed = ingestSchema.safeParse(JSON.parse(body))
  if (!parsed.success) {
    return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: parsed.error.message } }, { status: 400 })
  }

  const topic = ingestTopic({
    ...parsed.data,
    createdAt: new Date().toISOString(),
    status: 'new',
  } as Parameters<typeof ingestTopic>[0])

  return NextResponse.json(topic, { status: 201 })
}
