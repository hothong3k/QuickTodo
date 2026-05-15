import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb-client'
import { connectDB } from '@/lib/mongoose'
import bcrypt from 'bcryptjs'

// Tạm thời import User model qua mongoose để tránh lỗi kép
async function findUserByEmail(email: string) {
  await connectDB()
  // Dùng dynamic import để tránh circular dependencies
  const mongoose = (await import('mongoose')).default
  const db = mongoose.connection.db
  if (!db) return null
  return db.collection('users').findOne({ email })
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mật khẩu', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await findUserByEmail(credentials.email)
        if (!user || !user.passwordHash) return null

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!isValid) return null

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image ?? null,
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Lần đăng nhập đầu tiên, user có giá trị
      if (user) {
        token.userId = user.id
        token.name = user.name
        token.email = user.email
        token.picture = user.image
      }
      if (trigger === 'update' && session?.user) {
        token.name = session.user.name ?? token.name
        token.email = session.user.email ?? token.email
        token.picture = session.user.image ?? token.picture
      }
      return token
    },
    async session({ session, token }) {
      // Đưa userId vào session để dùng ở Server Actions
      if (token.userId) {
        session.user.id = token.userId as string
      }
      session.user.name = token.name ?? session.user.name
      session.user.email = token.email ?? session.user.email
      session.user.image = token.picture ?? session.user.image
      return session
    },
  },

  pages: {
    signIn: '/auth/signin',
    // error: '/auth/error', // tuỳ chọn thêm trang lỗi
  },

  secret: process.env.NEXTAUTH_SECRET,
}
