import { NextResponse } from 'next/server'
import { APP_TIME_ZONE, getLocalDateString } from '@/lib/current-date'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    today: getLocalDateString(APP_TIME_ZONE),
    timeZone: APP_TIME_ZONE,
    source: 'server',
  })
}
