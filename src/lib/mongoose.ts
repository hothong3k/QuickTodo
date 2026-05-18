import mongoose, { type ConnectOptions } from 'mongoose'

const mongooseOptions: ConnectOptions = {
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

type MongooseCache = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var _mongooseCache: MongooseCache | undefined
}

const cached: MongooseCache = global._mongooseCache ?? { conn: null, promise: null }
if (!global._mongooseCache) global._mongooseCache = cached

mongoose.set('bufferCommands', false)

function getMongoUri() {
  const uri = process.env.MONGODB_URI || process.env.MONGODB_URL

  if (!uri) {
    throw new Error('Missing MongoDB connection string. Set MONGODB_URI.')
  }

  return uri
}

export async function connectDB() {
  if (cached.conn) {
    if (cached.conn.connection.readyState === 1) return cached.conn

    cached.conn = null
    if (mongoose.connection.readyState === 0) cached.promise = null
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(getMongoUri(), mongooseOptions)
  }

  try {
    cached.conn = await cached.promise
    return cached.conn
  } catch (error) {
    cached.promise = null
    cached.conn = null
    throw error
  }
}
