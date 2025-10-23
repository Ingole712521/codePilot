const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')

console.log('🚀 Starting Test Bot...')

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: 'test-bot'
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

client.on('message', async (message) => {
    console.log(`📨 Got: ${message.body}`)
    
    try {
        await client.sendMessage(message.from, `Bot says: ${message.body}`)
        console.log('✅ Sent response')
    } catch (error) {
        console.error('❌ Error:', error)
    }
})

client.initialize()
