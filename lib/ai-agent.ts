import { AIAgent } from './services/AIAgent'

// Global AI Agent instance
let aiAgent: AIAgent | null = null

export function getAIAgent(): AIAgent {
	if (!aiAgent) {
		aiAgent = new AIAgent()
	}
	return aiAgent
}

export async function startAIAgent() {
	const agent = getAIAgent()
	await agent.start()
	return agent
}

export async function stopAIAgent() {
	if (aiAgent) {
		await aiAgent.stop()
		aiAgent = null
	}
}
