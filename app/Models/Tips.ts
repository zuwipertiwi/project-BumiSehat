import mongoose from '../../start/mongodb'

const tipsSchema = new mongoose.Schema({
  judul: { type: String, required: true },
  kategori: { type: mongoose.Schema.Types.ObjectId, ref: 'KategoriTips' },
  konten: { type: String, required: true },
  gambar: { type: String },
  dampak: { type: String },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' }
}, { timestamps: { createdAt: true, updatedAt: true } });

export default module.exports = mongoose.model('Tips', tipsSchema);
