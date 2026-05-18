import { MongoClient, type MongoClientOptions } from 'mongodb'

const mongoClientOptions: MongoClientOptions = {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 0,
}

type MongoClientCache = {
  client: MongoClient | null
  promise: Promise<MongoClient> | null
}

declare global {
  var _mongoClientCache: MongoClientCache | undefined
}

const cached: MongoClientCache = global._mongoClientCache ?? {
  client: null,
  promise: null,
}
if (!global._mongoClientCache) global._mongoClientCache = cached

function getMongoUri() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error('Missing MongoDB connection string. Set MONGODB_URI.')
  }

  return uri
}

export async function getMongoClient(): Promise<MongoClient> {
  if (cached.client) return cached.client

  if (!cached.promise) {
    cached.promise = new MongoClient(getMongoUri(), mongoClientOptions).connect()
  }

  try {
    cached.client = await cached.promise
    return cached.client
  } catch (error) {
    cached.promise = null
    cached.client = null
    throw error
  }
}

// ClientPromise dùng cho NextAuth MongoDB Adapter
const clientPromise: Promise<MongoClient> = getMongoClient()

export default clientPromise
