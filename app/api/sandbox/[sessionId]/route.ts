import { NextRequest, NextResponse } from 'next/server'
import { AIAgent } from '@/lib/services/AIAgent'

const aiAgent = new AIAgent()

export async function GET(
	request: NextRequest,
	{ params }: { params: { sessionId: string } }
) {
	try {
		const session = aiAgent.getSandboxSession(params.sessionId)
		
		if (!session) {
			return NextResponse.json(
				{ success: false, error: 'Sandbox session not found' },
				{ status: 404 }
			)
		}

		return NextResponse.json({ success: true, session })
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		)
	}
}

export async function POST(
	request: NextRequest,
	{ params }: { params: { sessionId: string } }
) {
	try {
		const { action } = await request.json()
		
		if (action === 'generate-fixes') {
			const fixes = await aiAgent.generateFixesForSession(params.sessionId)
			return NextResponse.json({ success: true, fixes })
		}

		return NextResponse.json(
			{ success: false, error: 'Invalid action' },
			{ status: 400 }
		)
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		)
	}
}
