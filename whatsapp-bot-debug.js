const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')

console.log('🚀 Starting CodePilot WhatsApp Bot (Debug Version)...')

// Initialize WhatsApp client with fresh session
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: 'codepilot-bot-debug' // Use different session ID
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
})

// Add more event handlers for debugging
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
    console.log('📊 Bot is listening for messages...')
})

client.on('authenticated', () => {
    console.log('✅ WhatsApp authentication successful!')
})

client.on('auth_failure', (msg) => {
    console.error('❌ Authentication failed:', msg)
})

client.on('disconnected', (reason) => {
    console.log('⚠️ WhatsApp Bot disconnected:', reason)
})

client.on('message', async (message) => {
    try {
        console.log(`📨 Received message from ${message.from}: ${message.body}`)
        console.log(`📱 Message type: ${message.type}`)
        console.log(`👤 From: ${message.from}`)
        
        // Respond to ANY message for testing
        if (message.body) {
            console.log(`🤖 Responding to: ${message.body}`)
            
            try {
                // Send immediate response
                await client.sendMessage(message.from, `🤖 Hello! I received your message: "${message.body}"`)
                console.log('✅ Response sent successfully')
                
                // Send second response
                await client.sendMessage(message.from, `💬 I'm CodePilot AI! I can help you analyze code and repositories.`)
                console.log('✅ Second response sent successfully')
                
                // Send third response with instructions
                await client.sendMessage(message.from, `🔗 Try sending a GitHub repository link for analysis!`)
                console.log('✅ Third response sent successfully')
                
            } catch (sendError) {
                console.error('❌ Error sending message:', sendError)
            }
        }
    } catch (error) {
        console.error('❌ Error handling message:', error)
    }
})

client.on('message_create', (message) => {
    console.log('📤 Message created:', message.body)
})

// Start the bot
console.log('⏳ Please wait while the bot initializes...')
client.initialize().catch(error => {
    console.error('❌ Failed to initialize bot:', error)
})
