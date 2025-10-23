const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')

console.log('🚀 Starting FINAL WhatsApp Bot...')

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: 'final-bot'
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

// Handle both message events
client.on('message', async (message) => {
    console.log(`📨 MESSAGE EVENT: ${message.body}`)
    await sendResponse(message)
})

client.on('message_create', async (message) => {
    console.log(`📤 MESSAGE_CREATE: ${message.body}`)
    await sendResponse(message)
})

async function sendResponse(message) {
    try {
        console.log(`🤖 Sending response to: ${message.body}`)
        await client.sendMessage(message.from, `🤖 Bot received: "${message.body}"`)
        console.log('✅ Response sent!')
    } catch (error) {
        console.error('❌ Error:', error)
    }
}

client.initialize()
