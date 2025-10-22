import { prisma } from '@/lib/db'
import { EncryptionService } from '@/lib/services/encryption'
import crypto from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

export interface AuthUser {
  id: string
  name: string
  email: string
  platform: string
  githubConnected: boolean
}

export function createToken(user: AuthUser): string {
  const header = { alg: 'HS256', typ: 'JWT' }
  const payload = { userId: user.id, exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) }
  
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url')
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${encodedHeader}.${encodedPayload}`).digest('base64url')
  
  return `${encodedHeader}.${encodedPayload}.${signature}`
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const [header, payload, signature] = token.split('.')
    const expectedSignature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${payload}`).digest('base64url')
    
    if (signature !== expectedSignature) return null
    
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (decoded.exp < Math.floor(Date.now() / 1000)) return null
    
    return { id: decoded.userId, name: '', email: '', platform: 'WEB', githubConnected: false }
  } catch {
    return null
  }
}

export async function findOrCreateUser(githubData: any): Promise<AuthUser> {
  const { id, login, email, name } = githubData
  
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { githubId: id.toString() },
        { email: email }
      ]
    }
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        platform: 'WEB',
        platformId: id.toString(),
        email: email,
        name: name || login,
        githubId: id.toString(),
        githubEmail: email,
        githubName: name || login,
      }
    })
  } else {
    // Update with latest GitHub data
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        githubId: id.toString(),
        githubEmail: email,
        githubName: name || login,
      }
    })
  }

  return {
    id: user.id,
    name: user.name || '',
    email: user.email || '',
    platform: user.platform,
    githubConnected: !!user.githubToken
  }
}

export async function storeGitHubToken(userId: string, token: string) {
  const encryptedToken = EncryptionService.encrypt(token)
  await prisma.user.update({
    where: { id: userId },
    data: { githubToken: encryptedToken }
  })
}

export async function getGitHubToken(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })
  
  if (!user?.githubToken) return null
  
  return EncryptionService.decrypt(user.githubToken)
}
