import mongoose from '../../start/mongodb'

const AktivitasSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  kategori_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Kategori' },
  tanggal: Date,
  deskripsi: String,
  lokasi: String,
  manfaat: String,
  status: { type: String, enum: ['disetujui', 'pending', 'ditolak'], default: 'pending' },
  alasan_penolakan: String,
}, { timestamps: true })

export default mongoose.model('Aktivitas', AktivitasSchema)
