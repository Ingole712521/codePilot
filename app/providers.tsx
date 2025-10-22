'use client'

// @ts-ignore - SessionProvider exists in same directory
import { SessionProvider } from './SessionProvider'

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			{children}
		</SessionProvider>
	)
}
