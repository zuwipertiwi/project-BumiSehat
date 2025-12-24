import mongoose from 'mongoose'

interface IKategori extends mongoose.Document {
  nama: string
  icon: string
  deskripsi?: string
}

const kategoriSchema = new mongoose.Schema<IKategori>(
  {
    nama: {
      type: String,
      required: true,
      unique: true,
    },
    icon: {
      type: String,
      required: true,
    },
    deskripsi: String,
  },
  { timestamps: true }
)

export default mongoose.models.Kategori || mongoose.model('Kategori', kategoriSchema)
