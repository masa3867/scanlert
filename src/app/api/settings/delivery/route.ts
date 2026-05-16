import { NextRequest, NextResponse } from 'next/server'
import { getDeliverySettings, updateDeliverySettings } from '@/lib/db'

export async function GET() {
  const settings = await getDeliverySettings()
  return NextResponse.json(settings)
}

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const settings = await updateDeliverySettings(body)
  return NextResponse.json(settings)
}
