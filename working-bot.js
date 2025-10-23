const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')

console.log('🚀 Starting Working WhatsApp Bot...')

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: 'working-bot'
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
    console.log('✅ Bot is ready and listening!')
})

client.on('message', async (message) => {
    console.log(`📨 Message received: ${message.body}`)
    
    try {
        // Send response
        await client.sendMessage(message.from, `🤖 Bot received: ${message.body}`)
        console.log('✅ Response sent!')
    } catch (error) {
        console.error('❌ Error:', error)
    }
})

// Start the bot
client.initialize()
