'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface User {
	id: string
	name: string
	email: string
	platform: string
	githubConnected: boolean
}

interface SessionContextType {
	user: User | null
	isLoading: boolean
	login: (user: User) => void
	logout: () => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		checkAuth()
	}, [])

	const checkAuth = async () => {
		try {
			const response = await fetch('/api/auth/session')
			if (response.ok) {
				const data = await response.json()
				setUser(data.user)
			}
		} catch (error) {
			console.error('Auth check failed:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const login = (userData: User) => setUser(userData)
	const logout = async () => {
		await fetch('/api/auth/logout', { method: 'POST' })
		setUser(null)
	}

	return (
		<SessionContext.Provider value={{ user, isLoading, login, logout }}>
			{children}
		</SessionContext.Provider>
	)
}

export const useSession = () => {
	const context = useContext(SessionContext)
	if (context === undefined) throw new Error('useSession must be used within a SessionProvider')
	return context
}
