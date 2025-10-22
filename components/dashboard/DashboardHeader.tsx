'use client'

import { useSession } from '@/app/SessionProvider'

export function DashboardHeader() {
	const { user, logout } = useSession()
	return (
		<header className="border-b bg-white px-6 py-4">
			<div className="flex items-center justify-between">
				<div className="text-lg font-medium">Dashboard</div>
				<div className="flex items-center gap-3">
					<span className="text-sm text-gray-600">{user?.name}</span>
					<button className="text-sm text-gray-500" onClick={logout}>Logout</button>
				</div>
			</div>
		</header>
	)
}
