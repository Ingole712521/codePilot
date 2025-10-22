'use client'

export function DashboardStats() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{[
				{ name: 'Connected Repos', value: '0' },
				{ name: 'Issues Found', value: '0' },
				{ name: 'Issues Fixed', value: '0' },
				{ name: 'PRs Created', value: '0' },
			].map((s) => (
				<div key={s.name} className="bg-white rounded-lg border p-6">
					<p className="text-sm text-gray-600">{s.name}</p>
					<p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
				</div>
			))}
		</div>
	)
}
