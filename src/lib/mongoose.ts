import mongoose, { type ConnectOptions } from 'mongoose'

const mongooseOptions: ConnectOptions = {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 0,
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

function getMongoUri() {
  const uri = process.env.MONGODB_URI || process.env.MONGODB_URL

  if (!uri) {
    throw new Error('Missing MongoDB connection string. Set MONGODB_URI.')
  }

  return uri
}

export async function connectDB() {
  if (cached.conn) return cached.conn

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
