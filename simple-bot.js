const { Client, LocalAuth } = require('whatsapp-web.js')

console.log('🚀 Starting Simple WhatsApp Bot...')

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: 'simple-bot'
    }),
    puppeteer: {
        headless: false, // Show browser for debugging
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
})

client.on('qr', (qr) => {
    console.log('QR Code received!')
    console.log('Scan this QR code with your WhatsApp:')
    console.log(qr)
})

client.on('ready', () => {
    console.log('✅ Bot is ready!')
    console.log('📱 Send any message to test')
})

client.on('message', async (message) => {
    console.log(`📨 Message received: ${message.body}`)
    
    if (message.body) {
        try {
            await client.sendMessage(message.from, `Bot received: ${message.body}`)
            console.log('✅ Response sent')
        } catch (error) {
            console.error('❌ Error sending response:', error)
        }
    }
})

console.log('⏳ Initializing...')
client.initialize()
