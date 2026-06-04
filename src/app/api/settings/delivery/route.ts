import { NextRequest, NextResponse } from 'next/server'
import { getDeliverySettings, updateDeliverySettings } from '@/lib/db'
import { revalidateDashboardPaths } from '@/lib/revalidate-dashboard'

export async function GET() {
  const settings = await getDeliverySettings()
  return NextResponse.json(settings)
}

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const settings = await updateDeliverySettings(body)
  revalidateDashboardPaths()
  return NextResponse.json(settings)
}
