// App/Models/User.ts
import mongoose from '../../start/mongodb'
import Aktivitas from './Aktivitas'

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  foto: String,
  nomor_telepon: String,
  lokasi: String,
  tanggal_lahir: Date,
  jenis_kelamin: String,
  bio: String,
  profil_publik: { type: Boolean, default: true },
  share_aktivitas: { type: Boolean, default: true },
  notifikasi_email: { type: Boolean, default: true },
}, { timestamps: true })

// Method untuk mendapatkan statistik user
UserSchema.methods.getStats = async function() {

  const totalAktivitas = await Aktivitas.countDocuments({
    user_id: this._id,
    status: 'disetujui'
  })

  // Hitung aktivitas bulan ini
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const aktivitasBulanIni = await Aktivitas.countDocuments({
    user_id: this._id,
    status: 'disetujui',
    tanggal: { $gte: startOfMonth }
  })

  // Hitung streak (aktivitas berturut-turut)
  const streak = await this.calculateStreak()

  // Hitung statistik per kategori bulan ini
  const statsPerKategori = await Aktivitas.aggregate([
    {
      $match: {
        user_id: this._id,
        status: 'disetujui',
        tanggal: { $gte: startOfMonth }
      }
    },
    {
      $lookup: {
        from: 'kategoris',
        localField: 'kategori_id',
        foreignField: '_id',
        as: 'kategori'
      }
    },
    {
      $unwind: '$kategori'
    },
    {
      $group: {
        _id: '$kategori.nama',
        count: { $sum: 1 },
        icon: { $first: '$kategori.icon' }
      }
    }
  ])

  return {
    totalAktivitas,
    aktivitasBulanIni,
    streak,
    statsPerKategori
  }
}

// Method untuk menghitung streak
UserSchema.methods.calculateStreak = async function() {

  const aktivitas = await Aktivitas.find({
    user_id: this._id,
    status: 'disetujui'
  }).sort({ tanggal: -1 }).select('tanggal')

  if (aktivitas.length === 0) return 0

  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  for (let i = 0; i < aktivitas.length; i++) {
    const aktDate = new Date(aktivitas[i].tanggal)
    aktDate.setHours(0, 0, 0, 0)

    const diffDays = Math.floor((currentDate.getTime() - aktDate.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === streak) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

// Method untuk mendapatkan aktivitas terbaru
UserSchema.methods.getRecentActivities = async function(limit = 5) {

  return await Aktivitas.find({
    user_id: this._id,
    status: 'disetujui'
  })
  .populate('kategori_id', 'nama icon')
  .sort({ tanggal: -1 })
  .limit(limit)
}
export type UserType = mongoose.Document & {
  name: string
  email: string
  password: string
  foto?: string
  nomor_telepon?: string
  lokasi?: string
  tanggal_lahir?: Date
  jenis_kelamin?: string
  bio?: string
  profil_publik: boolean
  share_aktivitas: boolean
  notifikasi_email: boolean

  getStats(): Promise<any>
  calculateStreak(): Promise<number>
  getRecentActivities(limit?: number): Promise<any[]>
}

const User = mongoose.model<UserType>('User', UserSchema)
export default User

