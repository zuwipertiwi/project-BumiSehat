import mongoose from '../../start/mongodb'

const KategoriTipsSchema = new mongoose.Schema({
  nama: String,
  icon: String,
}, { timestamps: true })

export default mongoose.model('KategoriTips', KategoriTipsSchema)
