const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')

console.log('🚀 Starting FRESH WhatsApp Bot...')

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: 'fresh-bot-' + Date.now() // Unique session ID
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
})

client.on('qr', (qr) => {
    console.log('🔗 FRESH QR Code:')
    qrcode.generate(qr, { small: true })
    console.log('📱 Scan this QR code with your WhatsApp')
    console.log('⏳ Wait for "Bot is ready!" message')
})

client.on('ready', () => {
    console.log('✅ FRESH Bot is ready and listening!')
    console.log('📱 Send any message to test')
})

client.on('message', async (message) => {
    console.log(`📨 MESSAGE RECEIVED: ${message.body}`)
    console.log(`👤 From: ${message.from}`)
    
    try {
        await client.sendMessage(message.from, `🤖 Bot received: "${message.body}"`)
        console.log('✅ Response sent successfully!')
    } catch (error) {
        console.error('❌ Error sending response:', error)
    }
})

client.on('message_create', (message) => {
    console.log(`📤 Message created: ${message.body}`)
})

client.on('disconnected', (reason) => {
    console.log('⚠️ Bot disconnected:', reason)
})

console.log('⏳ Initializing fresh bot...')
client.initialize()
