import { NextRequest, NextResponse } from 'next/server'
import { getTopics } from '@/lib/db'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? undefined
  const topics = await getTopics(q)
  return NextResponse.json(topics)
}
