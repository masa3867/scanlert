import { NextRequest, NextResponse } from 'next/server'
import { updateWatch, deleteWatch } from '@/lib/db'
import { revalidateDashboardPaths } from '@/lib/revalidate-dashboard'
import { z } from 'zod'

const watchSchema = z.object({
  label: z.string().min(1).optional(),
  keywords: z.array(z.string()).optional(),
  sourceUrls: z.array(z.string().url()).optional(),
  enabled: z.boolean().optional(),
  scoreThreshold: z.number().min(0).max(100).optional(),
})

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const parsed = watchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: parsed.error.message } }, { status: 400 })
  }
  const updated = await updateWatch(id, parsed.data)
  if (!updated) return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Watch not found' } }, { status: 404 })
  revalidateDashboardPaths()
  return NextResponse.json(updated)
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const deleted = await deleteWatch(id)
  if (!deleted) return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Watch not found' } }, { status: 404 })
  revalidateDashboardPaths()
  return new NextResponse(null, { status: 204 })
}
