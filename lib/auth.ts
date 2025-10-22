// @ts-ignore - next-auth types will be available after npm install
import { NextAuthOptions } from 'next-auth'
// @ts-ignore
import { PrismaAdapter } from '@auth/prisma-adapter'
// @ts-ignore
import GitHubProvider from 'next-auth/providers/github'
// @ts-ignore
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@/lib/db'
import { EncryptionService } from '@/lib/services/encryption'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'read:user user:email repo'
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (account?.provider === 'github' && account.access_token) {
        try {
          // Find or create user
          let dbUser = await prisma.user.findFirst({
            where: {
              OR: [
                { githubId: user.id },
                { email: user.email }
              ]
            }
          })

          if (!dbUser) {
            // Create new user
            dbUser = await prisma.user.create({
              data: {
                platform: 'WEB',
                platformId: user.id!,
                email: user.email,
                name: user.name,
                githubId: user.id,
                githubToken: EncryptionService.encrypt(account.access_token),
                githubEmail: user.email,
                githubName: user.name,
              }
            })
          } else {
            // Update existing user with GitHub token
            await prisma.user.update({
              where: { id: dbUser.id },
              data: {
                githubId: user.id,
                githubToken: EncryptionService.encrypt(account.access_token),
                githubEmail: user.email,
                githubName: user.name,
              }
            })
          }
        } catch (error) {
          console.error('Error in signIn callback:', error)
          return false
        }
      }
      return true
    },
    async session({ session, token }: any) {
      if (token?.sub) {
        const user = await prisma.user.findUnique({
          where: { id: token.sub }
        })
        if (user) {
          session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            platform: user.platform,
            githubConnected: !!user.githubToken
          }
        }
      }
      return session
    },
    async jwt({ token, user, account }: any) {
      if (user) {
        token.sub = user.id
      }
      return token
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
}
