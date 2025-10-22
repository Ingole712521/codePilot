import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const token = req.cookies.get('auth-token')?.value
  
  if (token) {
    try {
      // Delete session from database
      await prisma.session.deleteMany({
        where: { token: token }
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const response = NextResponse.json({ success: true })
  response.cookies.delete('auth-token')
  return response
}