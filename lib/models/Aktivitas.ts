import mongoose from 'mongoose'

interface IAktivitas extends mongoose.Document {
  user_id: mongoose.Schema.Types.ObjectId
  kategori_id: mongoose.Schema.Types.ObjectId
  judul: string
  deskripsi: string
  tanggal: Date
  lokasi: string
  foto?: string
  status: 'pending' | 'disetujui' | 'ditolak'
  catatan_reviewer?: string
  createdAt: Date
  updatedAt: Date
}

const aktivitasSchema = new mongoose.Schema<IAktivitas>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    kategori_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Kategori',
      required: true,
    },
    judul: {
      type: String,
      required: true,
    },
    deskripsi: {
      type: String,
      required: true,
    },
    tanggal: {
      type: Date,
      required: true,
    },
    lokasi: {
      type: String,
      required: true,
    },
    foto: String,
    status: {
      type: String,
      enum: ['pending', 'disetujui', 'ditolak'],
      default: 'pending',
    },
    catatan_reviewer: String,
  },
  { timestamps: true }
)

export default mongoose.models.Aktivitas || mongoose.model('Aktivitas', aktivitasSchema)
