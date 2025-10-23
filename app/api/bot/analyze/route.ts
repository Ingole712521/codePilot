import { NextRequest, NextResponse } from 'next/server'
import { AIAgent } from '@/lib/services/AIAgent'

const aiAgent = new AIAgent()

export async function POST(request: NextRequest) {
	try {
		const { repositoryUrl } = await request.json()
		
		if (!repositoryUrl) {
			return NextResponse.json(
				{ success: false, error: 'Repository URL is required' },
				{ status: 400 }
			)
		}

		const analysis = await aiAgent.analyzeRepository(repositoryUrl)
		return NextResponse.json({ success: true, analysis })
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		)
	}
}
