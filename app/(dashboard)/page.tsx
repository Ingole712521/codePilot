'use client'

import { useSession } from '@/app/SessionProvider'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { RepositoryList } from '@/components/dashboard/RepositoryList'

export default function DashboardPage() {
	const { user, isLoading } = useSession()
	if (isLoading) return <div className="p-10">Loading...</div>
    if (!user) return <div className="p-10">Please log in</div>

	return (
		<div className="space-y-6">
			<div className="bg-white rounded-lg shadow-sm border p-6">
				<h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
				<p className="text-gray-600 mt-2">Your AI code assistant is ready.</p>
			</div>
			<DashboardStats />
			<QuickActions />
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2"><RepositoryList /></div>
				<div className="lg:col-span-1"><RecentActivity /></div>
			</div>
		</div>
	)
}
