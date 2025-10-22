import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    message: 'Test endpoint working',
    timestamp: new Date().toISOString(),
    env: {
      githubClientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || 'undefined',
      githubClientSecret: process.env.GITHUB_CLIENT_SECRET ? 'Set' : 'Not set',
      jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Not set',
      allEnvKeys: Object.keys(process.env).filter(key => key.includes('GITHUB') || key.includes('JWT'))
    }
  })
}
