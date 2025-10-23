'use client'

import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { RepositoryList } from '@/components/dashboard/RepositoryList'

export default function DashboardPage() {
	return (
		<div className="space-y-6">
			<div className="bg-white rounded-lg shadow-sm border p-6">
				<h1 className="text-3xl font-bold text-gray-900">Welcome to CodePilot AI!</h1>
				<p className="text-gray-600 mt-2">Your AI code assistant is ready to help you analyze and fix code.</p>
				<div className="mt-4 p-4 bg-blue-50 rounded-lg">
					<p className="text-sm text-blue-800"><strong>Status:</strong> AI Agent Active</p>
					<p className="text-sm text-blue-800"><strong>WhatsApp Bot:</strong> Ready for @codepilot mentions</p>
					<p className="text-sm text-blue-800"><strong>Features:</strong> Code analysis, auto-fixes, sandbox environment</p>
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
