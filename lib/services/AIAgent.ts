import { WhatsAppBot } from './WhatsAppBot'
import { CodeAnalyzer } from './CodeAnalyzer'
import { OpenAIService } from './OpenAIService'
import { config } from '../config'

export interface SandboxSession {
	id: string
	repositoryUrl: string
	originalFiles: { [path: string]: string }
	fixedFiles: { [path: string]: string }
	issues: any[]
	createdAt: Date
}

export class AIAgent {
	private whatsappBot: WhatsAppBot
	private codeAnalyzer: CodeAnalyzer
	private openaiService: OpenAIService
	private sandboxSessions: Map<string, SandboxSession> = new Map()

	constructor() {
		this.whatsappBot = new WhatsAppBot()
		this.codeAnalyzer = new CodeAnalyzer()
		this.openaiService = new OpenAIService()
	}

	async start() {
		console.log('🤖 Starting CodePilot AI Agent...')
		
		// Start WhatsApp bot
		if (config.bot.platforms.whatsapp.enabled) {
			await this.whatsappBot.start()
		}

		console.log('✅ CodePilot AI Agent is ready!')
		console.log('📱 WhatsApp bot is active - mention @codepilot or @ai to interact')
	}

	async stop() {
		console.log('🛑 Stopping CodePilot AI Agent...')
		
		if (this.whatsappBot) {
			await this.whatsappBot.stop()
		}
		
		console.log('✅ CodePilot AI Agent stopped')
	}

	async createSandboxSession(repositoryUrl: string, issues: any[]): Promise<string> {
		const sessionId = `sandbox_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
		
		// This would typically fetch the original files from the repository
		// For now, we'll create a placeholder session
		const session: SandboxSession = {
			id: sessionId,
			repositoryUrl,
			originalFiles: {},
			fixedFiles: {},
			issues,
			createdAt: new Date()
		}

		this.sandboxSessions.set(sessionId, session)
		return sessionId
	}

	async generateFixesForSession(sessionId: string): Promise<{ [filePath: string]: string }> {
		const session = this.sandboxSessions.get(sessionId)
		if (!session) {
			throw new Error('Sandbox session not found')
		}

		const fixes = await this.codeAnalyzer.generateFixes(session.issues)
		session.fixedFiles = fixes
		this.sandboxSessions.set(sessionId, session)

		return fixes
	}

	getSandboxSession(sessionId: string): SandboxSession | undefined {
		return this.sandboxSessions.get(sessionId)
	}

	getAllSandboxSessions(): SandboxSession[] {
		return Array.from(this.sandboxSessions.values())
	}

	async analyzeRepository(repositoryUrl: string): Promise<any> {
		return await this.codeAnalyzer.analyzeRepository(repositoryUrl)
	}

	getBotStatus() {
		return {
			whatsapp: this.whatsappBot.getStatus(),
			// Add other bot statuses here
		}
	}
}
