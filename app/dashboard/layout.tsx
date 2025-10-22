import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'

export default function DashboardRouteLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-screen">
			<DashboardSidebar />
			<div className="flex-1">
				<DashboardHeader />
				<main className="p-6">{children}</main>
			</div>
		</div>
	)
}
