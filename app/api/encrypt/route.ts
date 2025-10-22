import { NextResponse } from 'next/server'
import { EncryptionService } from '@/lib/services/encryption'

export async function POST(req: Request) {
	try {
		const { text } = await req.json()
		if (typeof text !== 'string' || text.length === 0) {
			return NextResponse.json({ ok: false, error: 'text is required' }, { status: 400 })
		}
		const encrypted = EncryptionService.encrypt(text)
		const decrypted = EncryptionService.decrypt(encrypted)
		return NextResponse.json({ ok: true, encrypted, decrypted })
	} catch (error) {
		return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 })
	}
}
