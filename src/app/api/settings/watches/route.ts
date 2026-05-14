import { NextResponse } from 'next/server'
import { getWatches } from '@/lib/mock-data'

export async function GET() {
  return NextResponse.json(getWatches())
}
