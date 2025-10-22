import { NextResponse } from 'next/server'
import { OpenAIService } from '@/lib/services/OpenAIService'

export async function POST(req: Request) {
	try {
		const { code, fileName } = await req.json()
		if (!code || !fileName) return NextResponse.json({ ok: false, error: 'code and fileName are required' }, { status: 400 })
		const svc = new OpenAIService()
		const analysis = await svc.analyzeCode(code, fileName)
		return NextResponse.json({ ok: true, analysis })
	} catch (error) {
		return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 })
	}
}
