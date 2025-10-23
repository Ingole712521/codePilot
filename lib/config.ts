export const config = {
	bot: {
		platforms: {
			whatsapp: { enabled: true, sessionPath: './sessions' },
			slack: { enabled: true, botToken: process.env.SLACK_BOT_TOKEN!, appToken: process.env.SLACK_APP_TOKEN! },
		},
	},
	ai: {
		openai: { apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o-mini' },
	},
	server: {
		port: Number(process.env.PORT ?? 3000),
		nodeEnv: process.env.NODE_ENV || 'development',
	},
} as const

export function validateConfig() {
	const requiredKeys = [
		'OPENAI_API_KEY',
	]
	for (const key of requiredKeys) {
		if (!process.env[key]) {
			throw new Error(`Missing required environment variable: ${key}`)
		}
	}
}
