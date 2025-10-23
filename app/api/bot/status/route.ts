import { NextRequest, NextResponse } from 'next/server'
import { AIAgent } from '@/lib/services/AIAgent'

const aiAgent = new AIAgent()

export async function GET(request: NextRequest) {
	try {
		const status = aiAgent.getBotStatus()
		return NextResponse.json({ success: true, status })
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		)
	}
}
