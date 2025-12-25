import mongoose from 'mongoose'

interface IAktivitas extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId
  judul: string
  deskripsi: string
  dampak?: string
  kategori: string
  pohon_ditanam?: number
  tanggal?: Date
  lokasi?: string
  foto?: string
  status: 'pending' | 'disetujui' | 'ditolak'
  catatan_reviewer?: string
  createdAt: Date
  updatedAt: Date
}

const aktivitasSchema = new mongoose.Schema<IAktivitas>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
    dampak: {
      type: String,
      default: '',
    },
    kategori: {
      type: String,
      required: true,
    },
    pohon_ditanam: {
      type: Number,
      default: 0,
    },
    tanggal: {
      type: Date,
      default: () => new Date(),
    },
    lokasi: String,
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

// Clear model cache to avoid stale model issues in development
if (mongoose.models.Aktivitas) {
  delete mongoose.models.Aktivitas
}

export default mongoose.model('Aktivitas', aktivitasSchema)
