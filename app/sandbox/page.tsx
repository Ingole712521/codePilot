'use client'

import { useState, useEffect } from 'react'

interface SandboxSession {
	id: string
	repositoryUrl: string
	originalFiles: { [path: string]: string }
	fixedFiles: { [path: string]: string }
	issues: any[]
	createdAt: string
}

export default function SandboxPage() {
	const [sessions, setSessions] = useState<SandboxSession[]>([])
	const [selectedSession, setSelectedSession] = useState<SandboxSession | null>(null)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		fetchSessions()
	}, [])

	const fetchSessions = async () => {
		try {
			const response = await fetch('/api/sandbox/sessions')
			const data = await response.json()
			if (data.success) {
				setSessions(data.sessions)
			}
		} catch (error) {
			console.error('Error fetching sessions:', error)
		}
	}

	const createSandbox = async (repositoryUrl: string) => {
		setLoading(true)
		try {
			const response = await fetch('/api/sandbox/create', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ repositoryUrl })
			})
			const data = await response.json()
			if (data.success) {
				await fetchSessions()
			}
		} catch (error) {
			console.error('Error creating sandbox:', error)
		} finally {
			setLoading(false)
		}
	}

	const generateFixes = async (sessionId: string) => {
		try {
			const response = await fetch(`/api/sandbox/${sessionId}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'generate-fixes' })
			})
			const data = await response.json()
			if (data.success) {
				await fetchSessions()
			}
		} catch (error) {
			console.error('Error generating fixes:', error)
		}
	}

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">CodePilot Sandbox</h1>
				
				{/* Create New Sandbox */}
				<div className="bg-white rounded-lg shadow p-6 mb-8">
					<h2 className="text-xl font-semibold mb-4">Create New Sandbox</h2>
					<div className="flex gap-4">
						<input
							type="url"
							placeholder="Enter GitHub repository URL"
							className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							onKeyPress={(e) => {
								if (e.key === 'Enter') {
									const input = e.target as HTMLInputElement
									if (input.value) {
										createSandbox(input.value)
										input.value = ''
									}
								}
							}}
						/>
						<button
							onClick={() => {
								const input = document.querySelector('input[type="url"]') as HTMLInputElement
								if (input.value) {
									createSandbox(input.value)
									input.value = ''
								}
							}}
							disabled={loading}
							className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
						>
							{loading ? 'Creating...' : 'Create Sandbox'}
						</button>
					</div>
				</div>

				{/* Sandbox Sessions */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Sessions List */}
					<div className="bg-white rounded-lg shadow">
						<div className="p-6 border-b">
							<h2 className="text-xl font-semibold">Sandbox Sessions</h2>
						</div>
						<div className="p-6">
							{sessions.length === 0 ? (
								<p className="text-gray-500">No sandbox sessions yet</p>
							) : (
								<div className="space-y-4">
									{sessions.map((session) => (
										<div
											key={session.id}
											className={`p-4 border rounded-lg cursor-pointer transition-colors ${
												selectedSession?.id === session.id
													? 'border-blue-500 bg-blue-50'
													: 'border-gray-200 hover:border-gray-300'
											}`}
											onClick={() => setSelectedSession(session)}
										>
											<div className="flex justify-between items-start">
												<div>
													<p className="font-medium text-sm text-gray-600 truncate">
														{session.repositoryUrl}
													</p>
													<p className="text-xs text-gray-500">
														{new Date(session.createdAt).toLocaleString()}
													</p>
												</div>
												<span className="text-xs bg-gray-100 px-2 py-1 rounded">
													{session.issues.length} issues
												</span>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Session Details */}
					<div className="bg-white rounded-lg shadow">
						<div className="p-6 border-b">
							<h2 className="text-xl font-semibold">Session Details</h2>
						</div>
						<div className="p-6">
							{selectedSession ? (
								<div className="space-y-4">
									<div>
										<h3 className="font-medium text-gray-900">Repository</h3>
										<p className="text-sm text-gray-600 break-all">
											{selectedSession.repositoryUrl}
										</p>
									</div>
									
									<div>
										<h3 className="font-medium text-gray-900">Issues Found</h3>
										<p className="text-sm text-gray-600">
											{selectedSession.issues.length} issues detected
										</p>
									</div>

									<div className="flex gap-2">
										<button
											onClick={() => generateFixes(selectedSession.id)}
											className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
										>
											Generate Fixes
										</button>
										<button
											onClick={() => setSelectedSession(null)}
											className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
										>
											Close
										</button>
									</div>

									{Object.keys(selectedSession.fixedFiles).length > 0 && (
										<div>
											<h3 className="font-medium text-gray-900 mb-2">Fixed Files</h3>
											<div className="space-y-2">
												{Object.entries(selectedSession.fixedFiles).map(([path, content]) => (
													<div key={path} className="border rounded p-3">
														<p className="text-sm font-medium text-gray-700">{path}</p>
														<pre className="text-xs text-gray-600 mt-1 overflow-x-auto">
															{content.substring(0, 200)}...
														</pre>
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							) : (
								<p className="text-gray-500">Select a session to view details</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
