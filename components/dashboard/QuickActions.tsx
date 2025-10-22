'use client'

const actions = [
	{ title: 'Analyze Repository', href: '/tools' },
	{ title: 'Connect New Repo', href: '/tools' },
	{ title: 'Chat with Bot', href: '/tools' },
	{ title: 'Bot Settings', href: '/tools' },
]

export function QuickActions() {
	return (
		<div className="bg-white rounded-lg border p-6">
			<h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{actions.map((a) => (
					<button key={a.title} className="p-4 rounded-lg border hover:bg-gray-50 text-left" onClick={() => (window.location.href = a.href)}>
						<div className="font-medium text-gray-900">{a.title}</div>
						<div className="text-sm text-gray-500">Shortcut</div>
					</button>
				))}
			</div>
		</div>
	)
}
