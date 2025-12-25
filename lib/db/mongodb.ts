import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error(
    'Invalid/Missing environment variable: "MONGODB_URI". ' +
    'Please set MONGODB_URI in your environment variables. ' +
    'For development, use: mongodb://127.0.0.1:27017/bumisehat'
  )
}

let cached = global as any

if (!cached.mongo) {
  cached.mongo = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.mongo.conn) {
    console.log('♻️ Using cached MongoDB connection')
    return cached.mongo.conn
  }

  if (!cached.mongo.promise) {
    const opts = {
      bufferCommands: false,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    }

    console.log('🔌 Initiating new MongoDB connection...')
    console.log('📍 Connection URI:', MONGODB_URI.replace(/:[^:]*@/, ':****@'))

    cached.mongo.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ MongoDB connected successfully')
        return mongoose
      })
      .catch((error) => {
        console.error('❌ MongoDB connection failed:', error.message)
        cached.mongo.promise = null
        throw error
      })
  }

  try {
    cached.mongo.conn = await cached.mongo.promise
  } catch (e: any) {
    console.error('❌ MongoDB connection error:', e.message)
    cached.mongo.promise = null
    throw e
  }

  return cached.mongo.conn
}

export default connectDB
