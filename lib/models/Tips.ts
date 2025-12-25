import mongoose from 'mongoose'

interface ITips extends mongoose.Document {
  judul: string
  konten: string
  deskripsi?: string
  kategori?: string
  penulis: string
  foto?: string
  views: number
  createdAt: Date
  updatedAt: Date
}

const tipsSchema = new mongoose.Schema<ITips>(
  {
    judul: {
      type: String,
      required: true,
    },
    konten: {
      type: String,
      required: true,
    },
    deskripsi: {
      type: String,
      default: '',
    },
    kategori: {
      type: String,
      default: 'Umum',
    },
    penulis: {
      type: String,
      default: 'Admin BumiSehat',
    },
    foto: String,
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

// Clear model cache to avoid stale model issues in development
if (mongoose.models.Tips) {
  delete mongoose.models.Tips
}

export default mongoose.model('Tips', tipsSchema)
