import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js'
import { OpenAIService } from './OpenAIService'
import { CodeAnalyzer } from './CodeAnalyzer'
import { config } from '../config'

export interface BotMessage {
	from: string
	body: string
	timestamp: Date
	messageId: string
}

export class WhatsAppBot {
	private client: Client
	private openaiService: OpenAIService
	private codeAnalyzer: CodeAnalyzer
	private isReady = false

	constructor() {
		this.openaiService = new OpenAIService()
		this.codeAnalyzer = new CodeAnalyzer()
		
		this.client = new Client({
			authStrategy: new LocalAuth({
				clientId: 'codepilot-bot'
			}),
			puppeteer: {
				headless: true,
				args: ['--no-sandbox', '--disable-setuid-sandbox']
			}
		})

		this.setupEventHandlers()
	}

	private setupEventHandlers() {
		this.client.on('qr', (qr) => {
			console.log('QR RECEIVED', qr)
			// You can display this QR code in your frontend
		})

		this.client.on('ready', () => {
			console.log('WhatsApp Bot is ready!')
			this.isReady = true
		})

		this.client.on('message', async (message) => {
			await this.handleMessage(message)
		})

		this.client.on('disconnected', (reason) => {
			console.log('WhatsApp Bot disconnected:', reason)
			this.isReady = false
		})
	}

	private async handleMessage(message: any) {
		try {
			const messageBody = message.body.toLowerCase()
			
			// Check if bot is mentioned with @
			if (messageBody.includes('@codepilot') || messageBody.includes('@ai')) {
				await this.processBotMention(message)
			}
		} catch (error) {
			console.error('Error handling message:', error instanceof Error ? error.message : String(error))
		}
	}

	private async processBotMention(message: any) {
		const userMessage = message.body
		const chatId = message.from
		
		// Send typing indicator
		await this.client.sendMessage(chatId, '🤖 Analyzing your request...')
		
		try {
			// Check if message contains a repository link
			const repoLink = this.extractRepoLink(userMessage)
			
			if (repoLink) {
				await this.handleRepositoryAnalysis(chatId, repoLink)
			} else {
				await this.handleGeneralQuery(chatId, userMessage)
			}
		} catch (error) {
			await this.client.sendMessage(chatId, `❌ Error: ${error.message}`)
		}
	}

	private extractRepoLink(message: string): string | null {
		// Extract GitHub repository links
		const githubRegex = /https?:\/\/github\.com\/[^\/]+\/[^\/\s]+/g
		const matches = message.match(githubRegex)
		return matches ? matches[0] : null
	}

	private async handleRepositoryAnalysis(chatId: string, repoLink: string) {
		try {
			await this.client.sendMessage(chatId, `🔍 Analyzing repository: ${repoLink}`)
			
			// Analyze the repository
			const analysis = await this.codeAnalyzer.analyzeRepository(repoLink)
			
			if (analysis.hasIssues) {
				let response = `📊 **Code Analysis Results**\n\n`
				response += `**Summary:** ${analysis.summary}\n\n`
				response += `**Issues Found:** ${analysis.issues.length}\n\n`
				
				// Show top issues
				const topIssues = analysis.issues.slice(0, 3)
				topIssues.forEach((issue: any, index: number) => {
					response += `${index + 1}. **${issue.type.toUpperCase()}** (${issue.severity})\n`
					response += `   File: ${issue.file}\n`
					response += `   Issue: ${issue.description}\n`
					response += `   Fix: ${issue.suggestion}\n\n`
				})
				
				response += `\n🔧 I can fix these issues for you. Would you like me to create a sandbox with the fixes?`
				
				await this.client.sendMessage(chatId, response)
			} else {
				await this.client.sendMessage(chatId, '✅ Great! No issues found in your code.')
			}
		} catch (error) {
			await this.client.sendMessage(chatId, `❌ Error analyzing repository: ${error instanceof Error ? error.message : String(error)}`)
		}
	}

	private async handleGeneralQuery(chatId: string, message: string) {
		try {
			const response = await this.openaiService.generateResponse(message)
			await this.client.sendMessage(chatId, response)
		} catch (error) {
			await this.client.sendMessage(chatId, `❌ Error: ${error instanceof Error ? error.message : String(error)}`)
		}
	}

	async start() {
		try {
			await this.client.initialize()
		} catch (error) {
			console.error('Failed to start WhatsApp bot:', error)
		}
	}

	async stop() {
		try {
			await this.client.destroy()
		} catch (error) {
			console.error('Error stopping WhatsApp bot:', error)
		}
	}

	getStatus() {
		return {
			isReady: this.isReady,
			platform: 'whatsapp'
		}
	}
}
