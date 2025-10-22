"use client"

import { useState, useEffect } from 'react'

export default function ToolsPage() {
	const [text, setText] = useState('secret')
	const [encResult, setEncResult] = useState<any>(null)

	const [repos, setRepos] = useState<any[]>([])
	const [selectedRepo, setSelectedRepo] = useState('')

	const [fileName, setFileName] = useState('example.ts')
	const [code, setCode] = useState('export const x = 1')
	const [aiResult, setAiResult] = useState<any>(null)

	// Auto-load repos on page load
	useEffect(() => {
		loadRepos()
	}, [])

	async function encryptDemo() {
		const res = await fetch('/api/encrypt', { method: 'POST', body: JSON.stringify({ text }), headers: { 'Content-Type': 'application/json' } })
		setEncResult(await res.json())
	}

	async function loadRepos() {
		const res = await fetch('/api/github/repos')
		const data = await res.json()
		setRepos(data.repos ?? [])
	}

	async function analyze() {
		const res = await fetch('/api/ai/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, fileName }) })
		setAiResult(await res.json())
	}

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-8">
			<h1 className="text-2xl font-semibold">Developer Tools</h1>

			<section className="space-y-2">
				<h2 className="text-lg font-medium">Encryption</h2>
				<div className="flex gap-2">
					<input className="border px-2 py-1 flex-1" value={text} onChange={(e) => setText(e.target.value)} />
					<button className="bg-black text-white px-3 py-1" onClick={encryptDemo}>Encrypt</button>
				</div>
				{encResult && <pre className="bg-gray-100 p-2 overflow-auto text-xs">{JSON.stringify(encResult, null, 2)}</pre>}
			</section>

			<section className="space-y-2">
				<h2 className="text-lg font-medium">GitHub Repositories</h2>
				<div className="flex gap-2">
					<select 
						className="border px-2 py-1 flex-1" 
						value={selectedRepo} 
						onChange={(e) => setSelectedRepo(e.target.value)}
					>
						<option value="">Select a repository</option>
						{repos.map((r) => (
							<option key={r.id} value={r.full_name}>{r.full_name}</option>
						))}
					</select>
					<button className="bg-black text-white px-3 py-1" onClick={loadRepos}>Refresh</button>
				</div>
				{selectedRepo && (
					<div className="bg-blue-50 p-3 rounded">
						<p className="text-sm">Selected: <strong>{selectedRepo}</strong></p>
					</div>
				)}
			</section>

			<section className="space-y-2">
				<h2 className="text-lg font-medium">OpenAI Code Analysis</h2>
				<div className="flex gap-2">
					<input className="border px-2 py-1 w-56" placeholder="file name" value={fileName} onChange={(e) => setFileName(e.target.value)} />
					<button className="bg-black text-white px-3 py-1" onClick={analyze}>Analyze</button>
				</div>
				<textarea className="border w-full h-40 p-2 font-mono text-xs" value={code} onChange={(e) => setCode(e.target.value)} />
				{aiResult && <pre className="bg-gray-100 p-2 overflow-auto text-xs">{JSON.stringify(aiResult, null, 2)}</pre>}
			</section>
		</div>
	)
}
