import { NextResponse } from 'next/server'

type TelemetryPayload = {
  source?: string
  message?: string
  digest?: string
  stack?: string
  pathname?: string
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as TelemetryPayload
    console.error('[telemetry]', {
      source: payload.source ?? 'unknown',
      message: payload.message ?? 'no-message',
      digest: payload.digest ?? 'n/a',
      pathname: payload.pathname ?? 'n/a',
      stack: payload.stack?.slice(0, 1000) ?? 'n/a',
      at: new Date().toISOString(),
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}
