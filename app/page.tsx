'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface BotStatus {
  whatsapp: {
    isReady: boolean
    platform: string
  }
}

export default function Home() {
  const [botStatus, setBotStatus] = useState<BotStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBotStatus()
    startAIAgent()
  }, [])

  const startAIAgent = async () => {
    try {
      await fetch('/api/ai-agent/start', { method: 'POST' })
    } catch (error) {
      console.error('Failed to start AI agent:', error)
    }
  }

  const fetchBotStatus = async () => {
    try {
      const response = await fetch('/api/bot/status')
      const data = await response.json()
      if (data.success) {
        setBotStatus(data.status)
      }
    } catch (error) {
      console.error('Error fetching bot status:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            🤖 CodePilot AI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your AI coding assistant that analyzes repositories, finds issues, and provides fixes through WhatsApp and Slack.
          </p>
        </div>

        {/* Bot Status */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Bot Status</h2>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading bot status...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full mr-3 ${botStatus?.whatsapp.isReady ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div>
                  <h3 className="font-medium text-gray-900">WhatsApp Bot</h3>
                  <p className="text-sm text-gray-600">
                    {botStatus?.whatsapp.isReady ? 'Ready - Mention @codepilot to interact' : 'Not connected'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Chat Integration</h3>
            <p className="text-gray-600">
              Interact with the AI agent through WhatsApp by mentioning @codepilot or @ai
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Code Analysis</h3>
            <p className="text-gray-600">
              Share a GitHub repository link and get instant analysis of code issues
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-4">🛠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Auto Fixes</h3>
            <p className="text-gray-600">
              Get suggested fixes and see them in a sandbox environment
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sandbox"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Open Sandbox
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Use</h2>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">1</span>
              <p>Connect your WhatsApp to the bot (QR code will be displayed in console)</p>
            </div>
            <div className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">2</span>
              <p>Send a message mentioning @codepilot or @ai in your WhatsApp</p>
            </div>
            <div className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">3</span>
              <p>Share a GitHub repository link to get code analysis</p>
            </div>
            <div className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">4</span>
              <p>View fixes in the sandbox environment and run your code</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
