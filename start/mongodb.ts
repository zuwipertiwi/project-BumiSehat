import mongoose from 'mongoose'

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bumisehat'

mongoose.connect(mongoUri)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err))

export default mongoose
