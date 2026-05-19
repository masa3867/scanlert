import { NextRequest, NextResponse } from 'next/server'
import { getWatches, createWatch } from '@/lib/db'
import { z } from 'zod'

const createSchema = z.object({
  label: z.string().min(1),
  keywords: z.array(z.string()).default([]),
  sourceUrls: z.array(z.string()).default([]),
  scoreThreshold: z.number().min(0).max(100).default(60),
  enabled: z.boolean().default(true),
})

export async function GET() {
  return NextResponse.json(await getWatches())
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: parsed.error.message } }, { status: 400 })
  }
  const watch = await createWatch(parsed.data)
  return NextResponse.json(watch, { status: 201 })
}
