import { NextRequest, NextResponse } from 'next/server'
import { getWatches, createWatch } from '@/lib/db'
import { revalidateDashboardPaths } from '@/lib/revalidate-dashboard'
import { z } from 'zod'

const createSchema = z.object({
  label: z.string().min(1),
  keywords: z.array(z.string()).default([]),
  sourceUrls: z.array(z.string()).default([]),
  scoreThreshold: z.number().min(0).max(100).default(60),
  enabled: z.boolean().default(true),
})

export async function GET() {
  const { watches } = await getWatches()
  return NextResponse.json(watches)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: parsed.error.message } }, { status: 400 })
  }
  try {
    const watch = await createWatch(parsed.data)
    revalidateDashboardPaths()
    return NextResponse.json(watch, { status: 201 })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to create watch'
    return NextResponse.json({ error: { code: 'DB_ERROR', message } }, { status: 503 })
  }
}
