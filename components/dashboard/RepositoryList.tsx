'use client'

import { useState, useEffect } from 'react'

export function RepositoryList() {
	const [repos, setRepos] = useState<any[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		loadRepos()
	}, [])

	async function loadRepos() {
		try {
			const res = await fetch('/api/github/repos')
			const data = await res.json()
			if (data.ok) {
				setRepos(data.repos || [])
			}
		} catch (error) {
			console.error('Failed to load repos:', error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="bg-white rounded-lg border">
			<div className="p-6 border-b">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold text-gray-900">Your Repositories</h2>
					<button onClick={loadRepos} className="text-sm text-blue-600 hover:text-blue-700 font-medium">Refresh</button>
				</div>
			</div>
			<div className="divide-y">
				{loading ? (
					<div className="p-6 text-center text-gray-500">Loading repositories...</div>
				) : repos.length === 0 ? (
					<div className="p-6 text-center text-gray-500">No repositories found</div>
				) : (
					repos.map((repo) => (
						<div key={repo.id} className="p-6 hover:bg-gray-50 transition-colors">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium text-gray-900">{repo.full_name}</h3>
									<div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
										<span>{repo.private ? 'Private' : 'Public'}</span>
										<span>{repo.description || 'No description'}</span>
									</div>
								</div>
								<button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Analyze</button>
							</div>
						</div>
					))
				}
			</div>
		</div>
	)
}
