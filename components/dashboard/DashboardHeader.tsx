'use client'

export function DashboardHeader() {
	return (
		<header className="border-b bg-white px-6 py-4">
			<div className="flex items-center justify-between">
				<div className="text-lg font-medium">CodePilot AI Dashboard</div>
				<div className="flex items-center gap-3">
					<span className="text-sm text-gray-600">AI Agent Active</span>
					<div className="w-2 h-2 bg-green-500 rounded-full"></div>
				</div>
			</div>
		</header>
	)
}
