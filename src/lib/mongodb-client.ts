import { MongoClient, type MongoClientOptions } from 'mongodb'

const mongoClientOptions: MongoClientOptions = {
  appName: 'quicktodo',
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  timeoutMS: 15000,
  maxPoolSize: 10,
  minPoolSize: 0,
  maxConnecting: 2,
  maxIdleTimeMS: 60000,
  waitQueueTimeoutMS: 10000,
  heartbeatFrequencyMS: 10000,
  serverMonitoringMode: 'poll',
  retryReads: true,
  retryWrites: true,
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

export function isMongoTransientError(error: unknown) {
  if (!(error instanceof Error)) return false

  return (
    error.name === 'MongoServerSelectionError' ||
    error.name === 'MongoNetworkError' ||
    error.name === 'MongoNetworkTimeoutError' ||
    error.message.includes('ETIMEDOUT') ||
    error.message.includes('secureConnect') ||
    error.message.includes('Server selection timed out')
  )
}

export async function resetMongoClient() {
  const client = cached.client
  cached.client = null
  cached.promise = null

  if (client) {
    await client.close(true).catch(() => undefined)
  }
}

// Backward-compatible lazy promise for code that still expects clientPromise.
// Avoid starting a MongoDB connection just by importing this module.
const clientPromise = {
  then<TResult1 = MongoClient, TResult2 = never>(
    onfulfilled?:
      | ((value: MongoClient) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ) {
    return getMongoClient().then(onfulfilled, onrejected)
  },
  catch<TResult = never>(
    onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null
  ) {
    return getMongoClient().catch(onrejected)
  },
  finally(onfinally?: (() => void) | null) {
    return getMongoClient().finally(onfinally)
  },
  [Symbol.toStringTag]: 'Promise',
} satisfies Promise<MongoClient>

export default clientPromise
