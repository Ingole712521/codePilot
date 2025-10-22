import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { EncryptionService } from '@/lib/services/encryption'
import { GitHubService } from '@/lib/services/GitHubService'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ ok: false, error: 'Not authenticated' }, { status: 401 })
    }

    // Find session in database
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    })
    
    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ ok: false, error: 'Invalid session' }, { status: 401 })
    }

    // Get user's GitHub token
    if (!session.user.githubToken) {
      return NextResponse.json({ ok: false, error: 'GitHub not connected' }, { status: 400 })
    }

    // Decrypt and use the token
    const githubToken = EncryptionService.decrypt(session.user.githubToken)
    const gh = new GitHubService(githubToken)
    const repos = await gh.getUserRepositories()
    
    return NextResponse.json({ ok: true, repos })
  } catch (error) {
    console.error('GitHub repos error:', error)
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 })
  }
}