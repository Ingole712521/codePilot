const { AIAgent } = require('./services/AIAgent')

// Global AI Agent instance
let aiAgent = null

function getAIAgent() {
	if (!aiAgent) {
		aiAgent = new AIAgent()
	}
	return aiAgent
}

async function startAIAgent() {
	const agent = getAIAgent()
	await agent.start()
	return agent
}

async function stopAIAgent() {
	if (aiAgent) {
		await aiAgent.stop()
		aiAgent = null
	}
}

module.exports = {
	getAIAgent,
	startAIAgent,
	stopAIAgent
}
