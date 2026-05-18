import {
  _id,
  defaultCollections,
  format,
  type MongoDBAdapterOptions,
} from '@next-auth/mongodb-adapter'
import { ObjectId, type Collection } from 'mongodb'
import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from 'next-auth/adapters'
import {
  getMongoClient,
  isMongoTransientError,
  resetMongoClient,
} from '@/lib/mongodb-client'

type AdapterCollections = {
  U: Collection
  A: Collection
  S: Collection
  V: Collection
}

async function getCollections(
  options: MongoDBAdapterOptions
): Promise<AdapterCollections> {
  const client = await getMongoClient()
  const db = client.db(options.databaseName)
  const collections = { ...defaultCollections, ...options.collections }

  return {
    U: db.collection(collections.Users),
    A: db.collection(collections.Accounts),
    S: db.collection(collections.Sessions),
    V: db.collection(collections.VerificationTokens),
  }
}

async function runMongoOperation<T>(
  operation: (collections: AdapterCollections) => Promise<T>,
  options: MongoDBAdapterOptions
): Promise<T> {
  try {
    return await operation(await getCollections(options))
  } catch (error) {
    if (isMongoTransientError(error)) {
      await resetMongoClient()
    }

    throw error
  }
}

export function ResilientMongoDBAdapter(
  options: MongoDBAdapterOptions = {}
): Adapter {
  const { from, to } = format

  return {
    async createUser(data: Omit<AdapterUser, 'id'>) {
      return runMongoOperation(async ({ U }) => {
        const user = to(data)
        await U.insertOne(user)
        return from<AdapterUser>(user)
      }, options)
    },

    async getUser(id) {
      return runMongoOperation(async ({ U }) => {
        const user = await U.findOne({ _id: _id(id) })
        if (!user) return null
        return from<AdapterUser>(user)
      }, options)
    },

    async getUserByEmail(email) {
      return runMongoOperation(async ({ U }) => {
        const user = await U.findOne({ email })
        if (!user) return null
        return from<AdapterUser>(user)
      }, options)
    },

    async getUserByAccount(
      providerProviderAccountId: Pick<
        AdapterAccount,
        'provider' | 'providerAccountId'
      >
    ) {
      return runMongoOperation(async ({ A, U }) => {
        const account = await A.findOne(providerProviderAccountId)
        if (!account) return null

        const user = await U.findOne({ _id: new ObjectId(account.userId) })
        if (!user) return null

        return from<AdapterUser>(user)
      }, options)
    },

    async updateUser(data: Partial<AdapterUser> & Pick<AdapterUser, 'id'>) {
      return runMongoOperation(async ({ U }) => {
        const { _id, ...user } = to(data)
        const result = await U.findOneAndUpdate(
          { _id },
          { $set: user },
          { returnDocument: 'after' }
        )

        if (!result) throw new Error(`User not found: ${data.id}`)
        return from<AdapterUser>(result)
      }, options)
    },

    async deleteUser(id) {
      return runMongoOperation(async ({ A, S, U }) => {
        const userId = _id(id)
        await Promise.all([
          A.deleteMany({ userId }),
          S.deleteMany({ userId }),
          U.deleteOne({ _id: userId }),
        ])
      }, options)
    },

    async linkAccount(data: AdapterAccount) {
      return runMongoOperation(async ({ A }) => {
        const account = to(data)
        await A.insertOne(account)
        return from<AdapterAccount>(account)
      }, options)
    },

    async unlinkAccount(
      providerProviderAccountId: Pick<
        AdapterAccount,
        'provider' | 'providerAccountId'
      >
    ) {
      return runMongoOperation(async ({ A }) => {
        const account = await A.findOneAndDelete(providerProviderAccountId)
        if (!account) return undefined
        return from<AdapterAccount>(account)
      }, options)
    },

    async getSessionAndUser(sessionToken: string) {
      return runMongoOperation(async ({ S, U }) => {
        const session = await S.findOne({ sessionToken })
        if (!session) return null

        const user = await U.findOne({ _id: new ObjectId(session.userId) })
        if (!user) return null

        return {
          user: from<AdapterUser>(user),
          session: from<AdapterSession>(session),
        }
      }, options)
    },

    async createSession(data: AdapterSession) {
      return runMongoOperation(async ({ S }) => {
        const session = to(data)
        await S.insertOne(session)
        return from<AdapterSession>(session)
      }, options)
    },

    async updateSession(
      data: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>
    ) {
      return runMongoOperation(async ({ S }) => {
        const { _id: sessionId, ...session } = to(data)
        void sessionId
        const result = await S.findOneAndUpdate(
          { sessionToken: session.sessionToken },
          { $set: session },
          { returnDocument: 'after' }
        )

        if (!result) return null
        return from<AdapterSession>(result)
      }, options)
    },

    async deleteSession(sessionToken: string): Promise<void> {
      await runMongoOperation(async ({ S }) => {
        await S.findOneAndDelete({ sessionToken })
      }, options)
    },

    async createVerificationToken(data: VerificationToken) {
      return runMongoOperation(async ({ V }) => {
        await V.insertOne(to(data))
        return data
      }, options)
    },

    async useVerificationToken(identifierToken: {
      identifier: string
      token: string
    }) {
      return runMongoOperation(async ({ V }) => {
        const verificationToken = await V.findOneAndDelete(identifierToken)
        if (!verificationToken) return null

        const { _id: tokenId, ...token } = verificationToken
        void tokenId
        return token as VerificationToken
      }, options)
    },
  }
}
