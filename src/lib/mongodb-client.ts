import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI!

type MongoClientCache = {
  client: MongoClient | null
  promise: Promise<MongoClient> | null
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientCache: MongoClientCache | undefined
}

const cached: MongoClientCache = global._mongoClientCache ?? {
  client: null,
  promise: null,
}
if (!global._mongoClientCache) global._mongoClientCache = cached

export async function getMongoClient(): Promise<MongoClient> {
  if (cached.client) return cached.client

  if (!cached.promise) {
    cached.promise = new MongoClient(uri).connect()
  }

  cached.client = await cached.promise
  return cached.client
}

// ClientPromise dùng cho NextAuth MongoDB Adapter
const clientPromise: Promise<MongoClient> = (async () => {
  return getMongoClient()
})()

export default clientPromise
