'use client'

export function RecentActivity() {
	const activities = [
		{ repo: 'example/repo', action: 'Repository connected', time: 'just now' },
	]
	return (
		<div className="bg-white rounded-lg border">
			<div className="p-6 border-b"><h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2></div>
			<div className="divide-y">
				{activities.map((a, i) => (
					<div key={i} className="p-4">
						<div className="text-sm font-medium text-gray-900">{a.repo}</div>
						<div className="text-sm text-gray-500">{a.action}</div>
						<div className="text-xs text-gray-400">{a.time}</div>
					</div>
				))}
			</div>
		</div>
	)
}
