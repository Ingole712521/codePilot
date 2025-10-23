'use client'

import { useState } from 'react'

export default function BotTestPage() {
    const [message, setMessage] = useState('')
    const [response, setResponse] = useState('')
    const [loading, setLoading] = useState(false)

    const sendMessage = async () => {
        if (!message.trim()) return
        
        setLoading(true)
        try {
            const res = await fetch('/api/whatsapp/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: message,
                    from: 'test-user'
                })
            })
            
            const data = await res.json()
            if (data.success) {
                setResponse(data.response)
            } else {
                setResponse(`Error: ${data.error}`)
            }
        } catch (error) {
            setResponse(`Error: ${error}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">🤖 Bot Test Interface</h1>
                
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Test the AI Bot</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Message to Bot:
                            </label>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Try: codepilot help or ai analyze code"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            />
                        </div>
                        
                        <button
                            onClick={sendMessage}
                            disabled={loading || !message.trim()}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                        
                        {response && (
                            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                                <h3 className="font-medium text-gray-900 mb-2">Bot Response:</h3>
                                <p className="text-gray-700">{response}</p>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="mt-8 bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">How to Test:</h3>
                    <ul className="text-blue-800 space-y-1">
                        <li>• Try: "codepilot help"</li>
                        <li>• Try: "ai analyze this code"</li>
                        <li>• Try: "hello"</li>
                        <li>• Try: "codepilot analyze https://github.com/microsoft/vscode"</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
