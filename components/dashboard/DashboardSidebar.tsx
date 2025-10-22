'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
	{ name: 'Dashboard', href: '/dashboard' },
	{ name: 'Tools', href: '/tools' },
]

export function DashboardSidebar() {
	const pathname = usePathname()
	return (
		<div className="w-64 bg-white border-r min-h-screen">
			<div className="p-6 border-b">
				<h1 className="text-xl font-bold text-gray-900">CodePilot</h1>
				<p className="text-xs text-gray-500">AI Code Assistant</p>
			</div>
			<nav className="p-4 space-y-2">
				{navigation.map((item) => {
					const isActive = pathname === item.href
					return (
						<Link key={item.name} href={item.href} className={`block px-3 py-2 rounded-lg text-sm ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
							{item.name}
						</Link>
					)
				})}
			</nav>
		</div>
	)
}
