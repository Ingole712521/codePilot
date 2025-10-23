import OpenAI from 'openai'

export interface CodeIssue {
	type: 'bug' | 'security' | 'performance' | 'style' | 'refactor'
	description: string
	severity: 'high' | 'medium' | 'low'
	file: string
	line?: number
	suggestion: string
	originalCode?: string
	fixedCode?: string
}

export interface CodeAnalysis {
	hasIssues: boolean
	issues: CodeIssue[]
	summary: string
}

export class OpenAIService {
	private readonly openai: OpenAI

	constructor() {
		this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
	}

	async analyzeCode(code: string, fileName: string): Promise<CodeAnalysis> {
		const prompt = `Analyze this ${fileName} code for issues. Be thorough but concise.\n` +
			`Return ONLY valid JSON with keys: hasIssues, summary, issues[].` +
			`\nCode:\n\n\`\`\`\n${code}\n\`\`\``

		const response = await this.openai.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{ role: 'system', content: 'You are a strict JSON generator. Always return valid JSON.' },
				{ role: 'user', content: prompt },
			],
			temperature: 0.1,
			max_tokens: 1200,
		})
		const content = response.choices[0]?.message?.content?.trim()
		if (!content) {
			return { hasIssues: false, issues: [], summary: 'No response from OpenAI' }
		}
		try {
			return JSON.parse(content)
		} catch (_) {
			return { hasIssues: false, issues: [], summary: 'Failed to parse analysis' }
		}
	}

	async generateFix(issue: CodeIssue, context: string): Promise<string> {
		const prompt = `Fix the issue in ${issue.file}. Return ONLY code, no backticks or text.\n` +
			`Issue: ${issue.description}\n` +
			`Original Code:\n${issue.originalCode ?? ''}\n` +
			`Context:\n${context}`

		const response = await this.openai.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [{ role: 'user', content: prompt }],
			temperature: 0.1,
			max_tokens: 1000,
		})
		return response.choices[0]?.message?.content?.trim() || ''
	}

	async generateResponse(message: string): Promise<string> {
		const prompt = `You are CodePilot, an AI coding assistant. Help the user with their coding questions and provide helpful responses. Be concise and professional.\n\nUser message: ${message}`

		const response = await this.openai.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{ role: 'system', content: 'You are CodePilot, a helpful AI coding assistant. Provide clear, concise, and actionable responses.' },
				{ role: 'user', content: message }
			],
			temperature: 0.7,
			max_tokens: 500,
		})
		return response.choices[0]?.message?.content?.trim() || 'I apologize, but I couldn\'t generate a response.'
	}
}
