import mongoose from '../../start/mongodb'

const KategoriSchema = new mongoose.Schema({
  nama: String,
  icon: String,
}, { timestamps: true })

export default mongoose.model('Kategori', KategoriSchema)
