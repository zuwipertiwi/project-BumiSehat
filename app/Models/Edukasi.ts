// models/EdukasiArtikel.js
import mongoose from '../../start/mongodb'

const edukasiArtikelSchema = new mongoose.Schema({
  judul: { type: String, required: true },
  kategori: { type: mongoose.Schema.Types.ObjectId, ref: 'Kategori' },
  estimasi_waktu_baca: { type: Number }, // menit
  ringkasan: { type: String },
  konten: { type: String },
  status: { type: String, enum: ['draft', 'publish'], default: 'draft' },
  emoji: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('EdukasiArtikel', edukasiArtikelSchema);
