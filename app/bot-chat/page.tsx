'use client'

import { useState, useEffect } from 'react'

interface Message {
    id: string
    text: string
    sender: 'user' | 'bot'
    timestamp: Date
}

export default function BotChatPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [inputMessage, setInputMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const sendMessage = async () => {
        if (!inputMessage.trim()) return
        
        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date()
        }
        
        setMessages(prev => [...prev, userMessage])
        setLoading(true)
        
        try {
            const response = await fetch('/api/whatsapp/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: inputMessage,
                    from: 'web-user'
                })
            })
            
            const data = await response.json()
            
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: data.response,
                sender: 'bot',
                timestamp: new Date()
            }
            
            setMessages(prev => [...prev, botMessage])
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: `Error: ${error}`,
                sender: 'bot',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setLoading(false)
            setInputMessage('')
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-4xl mx-auto h-screen flex flex-col">
                {/* Header */}
                <div className="bg-blue-600 text-white p-4">
                    <h1 className="text-xl font-bold">🤖 CodePilot AI Chat</h1>
                    <p className="text-sm opacity-90">Your AI coding assistant</p>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-500 mt-8">
                            <p>👋 Hello! I'm CodePilot AI</p>
                            <p>Try asking me to analyze code or help with programming!</p>
                        </div>
                    )}
                    
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                    message.sender === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-800 border'
                                }`}
                            >
                                <p className="text-sm">{message.text}</p>
                                <p className="text-xs opacity-70 mt-1">
                                    {message.timestamp.toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    ))}
                    
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-white text-gray-800 border px-4 py-2 rounded-lg">
                                <p className="text-sm">🤖 Bot is typing...</p>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Input */}
                <div className="bg-white border-t p-4">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={loading}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || !inputMessage.trim()}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
