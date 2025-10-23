const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')

console.log('🚀 Starting SMART WhatsApp Bot...')

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: 'smart-bot'
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
})

client.on('qr', (qr) => {
    console.log('🔗 QR Code:')
    qrcode.generate(qr, { small: true })
    console.log('📱 Scan with WhatsApp')
})

client.on('ready', () => {
    console.log('✅ Bot ready!')
})

// Handle messages with proper filtering
client.on('message', async (message) => {
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
    
    console.log(`📨 MESSAGE: ${message.body}`)
    
    try {
        // Send response only once
        await client.sendMessage(message.from, `🤖 Bot received: "${message.body}"`)
        console.log('✅ Response sent!')
    } catch (error) {
        console.error('❌ Error:', error)
    }
})

client.initialize()
