import { NextResponse } from 'next/server'
import { colleges } from '@/data/colleges'

export async function GET() {
  const now = new Date().toISOString()

  return NextResponse.json({
    ok: true,
    service: 'nextdegree',
    time: now,
    collegesCount: colleges.length,
    version: '1',
  })
}
