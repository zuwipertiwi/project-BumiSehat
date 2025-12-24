import { BaseCommand } from '@adonisjs/core/build/standalone'
import User from '../app/Models/User'
import Kategori from '../app/Models/Kategori'
import mongoose from 'mongoose'
import KategoriTips from '../app/Models/KategoriTips'

export default class SeedData extends BaseCommand {
  public static commandName = 'seed:data'
  public static description = 'Seed dummy data to MongoDB'

  public async run() {
        await User.create({
          name: 'Admin',
          email: 'admin@example.com',
          password: '$2a$10$hashedpasswordforadmin', // sudah di-hash!
          foto: '',
          nomor_telepon: '',
          lokasi: '',
          tanggal_lahir: new Date('2000-01-01'),
          jenis_kelamin: 'Lainnya',
          bio: 'Administrator akun.',
          profil_publik: false,
          share_aktivitas: false,
          notifikasi_email: false,
        })

  await Kategori.insertMany([
    { nama: 'Penanaman Pohon', icon: '🌳' },
    { nama: 'Daur Ulang', icon: '♻️' },
    { nama: 'Hemat Air', icon: '🚿' },
  ])
  await KategoriTips.insertMany([
    { nama: 'Penanaman Pohon', icon: '🌳' },
    { nama: 'Daur Ulang', icon: '♻️' },
    { nama: 'Hemat Air', icon: '🚿' },
  ])

  // const user = await User.findOne({ email: 'fajry@gmail.com' })

  // if (user) {
  //   const Aktivitas = mongoose.model('Aktivitas')

  //   await Aktivitas.create({
  //   user_id: user._id,
  //   title: 'Menanam 10 Pohon',
  //   description: 'Rina Hijau telah menanam 10 pohon di area taman kota.',
  //   kategori_id: (await Kategori.findOne({ nama: 'Penanaman Pohon' }))?._id,
  //   tanggal: new Date(),
  //   status: 'disetujui',
  //   })

  //   await Aktivitas.create({
  //   user_id: user._id,
  //   title: 'Mendaur Ulang Plastik',
  //   description: 'Rina Hijau mendaur ulang 5 kg plastik di pusat daur ulang.',
  //   kategori_id: (await Kategori.findOne({ nama: 'Daur Ulang' }))?._id,
  //   tanggal: new Date(),
  //   status: 'disetujui',
  //   })
  // }


    this.logger.success('Seed berhasil ✅')
  }
}
