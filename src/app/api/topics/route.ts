import { NextRequest, NextResponse } from 'next/server'
import { getTopics } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? undefined
  const topics = getTopics(q)
  return NextResponse.json(topics)
}
