'use client'

import { useSession } from '@/app/SessionProvider'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { RepositoryList } from '@/components/dashboard/RepositoryList'

export default function DashboardPage() {
    const { user, isLoading, login } = useSession()
    if (isLoading) return <div className="p-10">Loading...</div>
    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold">Please log in</h1>
                    <p className="text-gray-600">Sign in to access your dashboard.</p>
                    <a
                        href="/login"
                        className="bg-black text-white px-4 py-2 rounded inline-block"
                    >
                        Go to Login
                    </a>
                </div>
            </div>
        )
    }

	return (
		<div className="space-y-6">
			<div className="bg-white rounded-lg shadow-sm border p-6">
				<h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
				<p className="text-gray-600 mt-2">Your AI code assistant is ready.</p>
				<div className="mt-4 p-4 bg-blue-50 rounded-lg">
					<p className="text-sm text-blue-800"><strong>Email:</strong> {user.email}</p>
					<p className="text-sm text-blue-800"><strong>Platform:</strong> {user.platform}</p>
					<p className="text-sm text-blue-800"><strong>GitHub Connected:</strong> {user.githubConnected ? 'Yes' : 'No'}</p>
				</div>
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
