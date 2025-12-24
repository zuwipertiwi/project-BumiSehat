import mongoose from 'mongoose'

interface ITips extends mongoose.Document {
  judul: string
  konten: string
  kategori_id?: mongoose.Schema.Types.ObjectId
  penulis: string
  foto?: string
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
    kategori_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'KategoriTips',
    },
    penulis: {
      type: String,
      required: true,
    },
    foto: String,
  },
  { timestamps: true }
)

export default mongoose.models.Tips || mongoose.model('Tips', tipsSchema)
