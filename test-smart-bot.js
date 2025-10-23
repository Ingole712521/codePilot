const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')

console.log('🧪 Starting TEST SMART WhatsApp Bot...')

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: 'test-smart-bot'
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
})

client.on('qr', (qr) => {
    console.log('🔗 TEST QR Code:')
    qrcode.generate(qr, { small: true })
    console.log('📱 Scan with WhatsApp')
})

client.on('ready', () => {
    console.log('✅ TEST Bot ready!')
    console.log('🧪 This bot will respond with a simple test message')
})

// Handle messages with proper filtering
client.on('message', async (message) => {
    console.log(`🔍 DEBUG: Message received from ${message.fromMe ? 'BOT' : 'USER'}`)
    console.log(`🔍 DEBUG: Message type: ${message.type}`)
    console.log(`🔍 DEBUG: Message body: "${message.body}"`)
    
    // Skip messages from the bot itself
    if (message.fromMe) {
        console.log('🚫 Skipping own message')
        return
    }
    
    // Skip system messages
    if (message.type === 'system') {
        console.log('🚫 Skipping system message')
        return
    }
    
    console.log(`📨 PROCESSING: ${message.body}`)
    
    try {
        // Send a simple test response
        await client.sendMessage(message.from, `🧪 TEST: I received "${message.body}"`)
        console.log('✅ TEST Response sent!')
    } catch (error) {
        console.error('❌ Error:', error)
    }
})

client.initialize()
