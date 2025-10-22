import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Test the connection first
    await prisma.$connect()
    
    // Try to create a simple test
    const testUser = await prisma.user.findFirst()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      hasUsers: !!testUser
    })
  } catch (error) {
    console.error('Database setup error:', error)
    return NextResponse.json({ 
      success: false, 
      error: String(error),
      message: 'Database connection failed'
    }, { status: 500 })
  }
}
