import { NextResponse } from 'next/server'
import { getWatches } from '@/lib/db'

export async function GET() {
  return NextResponse.json(await getWatches())
}
