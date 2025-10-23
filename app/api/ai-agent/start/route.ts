import { NextRequest, NextResponse } from 'next/server'
import { startAIAgent } from '@/lib/ai-agent'

let aiAgentStarted = false

export async function POST(request: NextRequest) {
	try {
		if (aiAgentStarted) {
			return NextResponse.json({ 
				success: true, 
				message: 'AI Agent is already running' 
			})
		}

		await startAIAgent()
		aiAgentStarted = true
		
		return NextResponse.json({ 
			success: true, 
			message: 'AI Agent started successfully' 
		})
	} catch (error) {
		return NextResponse.json(
			{ 
				success: false, 
				error: error instanceof Error ? error.message : String(error) 
			},
			{ status: 500 }
		)
	}
}
