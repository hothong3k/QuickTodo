import 'server-only'

import mongoose from 'mongoose'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongoose'

export type AccountProvider = 'google' | 'credentials'

export type AccountProfile = {
  id: string
  name: string | null
  email: string | null
  image: string | null
  provider: AccountProvider
  canEditCredentials: boolean
}

type UserDocument = {
  _id: mongoose.Types.ObjectId
  name?: string | null
  email?: string | null
  image?: string | null
  passwordHash?: string | null
}

function toObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id)
    ? new mongoose.Types.ObjectId(id)
    : null
}

export function normalizeAccountEmail(email: string) {
  return email.trim().toLowerCase()
}

export async function getCurrentAccountProfile(): Promise<AccountProfile | null> {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) return null

  const objectId = toObjectId(userId)
  if (!objectId) return null

  await connectDB()
  const db = mongoose.connection.db
  if (!db) return null

  const [user, googleAccount] = await Promise.all([
    db.collection<UserDocument>('users').findOne({ _id: objectId }),
    db.collection('accounts').findOne({ userId: objectId, provider: 'google' }),
  ])

  if (!user) return null

  const provider: AccountProvider = googleAccount ? 'google' : 'credentials'
  const canEditCredentials = provider === 'credentials' && Boolean(user.passwordHash)

  return {
    id: user._id.toString(),
    name: user.name ?? null,
    email: user.email ?? null,
    image: user.image ?? null,
    provider,
    canEditCredentials,
  }
}
