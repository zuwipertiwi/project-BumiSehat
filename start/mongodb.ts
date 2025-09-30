import mongoose from 'mongoose'

mongoose.connect('mongodb://127.0.0.1:27017/bumisehat')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err))

export default mongoose
