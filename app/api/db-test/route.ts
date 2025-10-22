import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
	try {
		const rows = await prisma.$queryRaw<{ now: Date }[]>`SELECT NOW() as now`
		return NextResponse.json({ ok: true, now: rows[0]?.now ?? null })
	} catch (error) {
		return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 })
	}
}
