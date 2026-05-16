import { NextRequest, NextResponse } from 'next/server'
import { getTopic, updateTopicStatus } from '@/lib/db'
import { z } from 'zod'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const topic = await getTopic(id)
  if (!topic) return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Topic not found' } }, { status: 404 })
  return NextResponse.json(topic)
}

const patchSchema = z.object({ status: z.enum(['new', 'read', 'dismissed']) })

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: parsed.error.message } }, { status: 400 })
  }
  const ok = await updateTopicStatus(id, parsed.data.status)
  if (!ok) return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Topic not found' } }, { status: 404 })
  return NextResponse.json({ success: true })
}
