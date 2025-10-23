import { startAIAgent } from '../lib/ai-agent.js'

async function main() {
  try {
    console.log('🚀 Starting CodePilot AI Agent...')
    await startAIAgent()
    console.log('✅ AI Agent started successfully!')
  } catch (error) {
    console.error('❌ Failed to start AI Agent:', error)
    process.exit(1)
  }
}

main()
