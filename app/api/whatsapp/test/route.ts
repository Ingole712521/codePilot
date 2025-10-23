import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!, {
    apiVersion: 'v1'
})

export async function GET(request: NextRequest) {
    return NextResponse.json({
        success: true,
        message: 'WhatsApp Bot API is working with Gemini AI!',
        timestamp: new Date().toISOString(),
        status: 'ready'
    })
}

export async function POST(request: NextRequest) {
    try {
        const { message, from } = await request.json()
        
        console.log(`📨 Received message from ${from}: ${message}`)
        
        // Simple intelligent response for now
        let response = ''
        
        if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
            response = `Hello! I'm CodePilot AI, your coding assistant. I can help you with:
- Code analysis and debugging
- Programming questions
- Code reviews and improvements
- Learning new technologies

What would you like to work on today?`
        } else if (message.toLowerCase().includes('help')) {
            response = `I'm here to help! I can assist with:
- JavaScript, Python, React, Node.js
- Code debugging and optimization
- Best practices and patterns
- Learning new concepts

Just ask me about any coding topic!`
        } else if (message.toLowerCase().includes('code') || message.toLowerCase().includes('programming')) {
            response = `Great! I love helping with code. You can:
- Share code snippets for review
- Ask about specific programming concepts
- Get help with debugging
- Learn new frameworks or languages

What specific coding topic interests you?`
        } else {
            response = `Thanks for your message: "${message}"

I'm CodePilot AI, your coding assistant. I can help with programming questions, code analysis, debugging, and learning new technologies. 

What would you like to explore?`
        }
        
        return NextResponse.json({
            success: true,
            response: response,
            timestamp: new Date().toISOString()
        })
        
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json({
            success: false,
            error: 'Failed to generate response',
            message: 'Sorry, I encountered an error. Please try again.'
        }, { status: 500 })
    }
}