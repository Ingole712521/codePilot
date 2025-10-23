const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')

// Initialize WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: 'codepilot-bot'
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
})

// Event handlers
client.on('qr', (qr) => {
    console.log('🔗 WhatsApp QR Code:')
    console.log('📱 Scan this QR code with your WhatsApp to connect the bot')
    console.log('')
    qrcode.generate(qr, { small: true })
    console.log('')
    console.log('✅ After scanning, the bot will be ready!')
})

client.on('ready', () => {
    console.log('🤖 WhatsApp Bot is ready!')
    console.log('💬 You can now mention @codepilot or @ai in any WhatsApp chat')
    console.log('🔗 Share GitHub repository links to get code analysis')
})

client.on('message', async (message) => {
    try {
        console.log(`📨 Received message from ${message.from}: ${message.body}`)
        
        // Respond to ANY message for testing
        if (message.body) {
            console.log(`🤖 Responding to: ${message.body}`)
            await client.sendMessage(message.from, `🤖 Hello! I received your message: "${message.body}"`)
            await client.sendMessage(message.from, `💬 Try sending: "codepilot help" or "ai help"`)
        }
    } catch (error) {
        console.error('Error handling message:', error)
        try {
            await client.sendMessage(message.from, `❌ Error: ${error.message}`)
        } catch (sendError) {
            console.error('Error sending error message:', sendError)
        }
    }
})

function extractRepoLink(message) {
    const githubRegex = /https?:\/\/github\.com\/[^\/]+\/[^\/\s]+/g
    const matches = message.match(githubRegex)
    return matches ? matches[0] : null
}

async function handleRepositoryAnalysis(chatId, repoLink) {
    try {
        await client.sendMessage(chatId, `🔍 Analyzing repository: ${repoLink}`)
        await client.sendMessage(chatId, `📊 This is a demo response. In the full version, I would analyze the code and provide detailed feedback about issues and fixes.`)
        await client.sendMessage(chatId, `🛠️ To see the full analysis, visit: http://localhost:3000/sandbox`)
    } catch (error) {
        await client.sendMessage(chatId, `❌ Error analyzing repository: ${error.message}`)
    }
}

async function handleGeneralQuery(chatId, message) {
    try {
        const response = `🤖 Hello! I'm CodePilot AI. I can help you analyze code repositories. 
        
📋 What I can do:
• Analyze GitHub repositories for issues
• Provide code fixes and suggestions
• Help with code reviews

🔗 To get started, share a GitHub repository link with me!

Example: @codepilot analyze https://github.com/microsoft/vscode`
        
        await client.sendMessage(chatId, response)
    } catch (error) {
        await client.sendMessage(chatId, `❌ Error: ${error.message}`)
    }
}

// Start the bot
console.log('🚀 Starting CodePilot WhatsApp Bot...')
console.log('⏳ Please wait while the bot initializes...')
client.initialize()
