import { NextRequest, NextResponse } from 'next/server'
import { EncryptionService } from '@/lib/services/encryption'
import { prisma } from '@/lib/db'
import crypto from 'crypto'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  
  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', req.url))
  }

  try {
    console.log('GitHub OAuth callback received')
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: 'Ov23liGGPq64BcUbLGc5',
        client_secret: 'bf8f64bd8b4513bec7e473ffec6ad414d8a3ca03',
        code: code,
      }),
    })

    const tokenData = await tokenResponse.json()
    console.log('Token exchange result:', tokenData)
    
    if (tokenData.error) {
      console.error('Token exchange failed:', tokenData.error_description)
      return NextResponse.redirect(new URL('/login?error=token_failed', req.url))
    }

    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    })

    if (!userResponse.ok) {
      console.error('Failed to fetch GitHub user info')
      return NextResponse.redirect(new URL('/login?error=user_fetch_failed', req.url))
    }

    const githubUser = await userResponse.json()
    console.log('GitHub user data:', githubUser)

    // Find or create user in database
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { githubId: githubUser.id.toString() },
          { platform: 'WEB', platformId: githubUser.id.toString() }
        ]
      }
    })

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          platform: 'WEB',
          platformId: githubUser.id.toString(),
          email: githubUser.email,
          name: githubUser.name || githubUser.login,
          githubId: githubUser.id.toString(),
          githubToken: EncryptionService.encrypt(tokenData.access_token),
          githubEmail: githubUser.email,
          githubName: githubUser.name || githubUser.login,
        }
      })
      console.log('Created new user:', user.id)
    } else {
      // Update existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          githubToken: EncryptionService.encrypt(tokenData.access_token),
          githubEmail: githubUser.email,
          githubName: githubUser.name || githubUser.login,
          email: githubUser.email,
          name: githubUser.name || githubUser.login,
        }
      })
      console.log('Updated existing user:', user.id)
    }

    // Create session token
    const sessionToken = crypto.randomBytes(32).toString('hex')
    
    // Store session in database
    await prisma.session.create({
      data: {
        userId: user.id,
        token: sessionToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      }
    })

    // Redirect to dashboard
    const response = NextResponse.redirect(new URL('/dashboard', req.url))
    response.cookies.set('auth-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })
    
    console.log('Login successful, redirecting to dashboard')
    return response

  } catch (error) {
    console.error('GitHub authentication error:', error)
    console.error('Error details:', error)
    return NextResponse.redirect(new URL(`/login?error=auth_failed&details=${encodeURIComponent(String(error))}`, req.url))
  }
}

// Database-backed authentication - no need to export in-memory storage