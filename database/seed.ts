
import User from '../app/Models/User'
import Kategori from '../app/Models/Kategori'
import mongoose from 'mongoose'

async function seed() {

  await User.create({
    name: 'Rina Hijau',
    email: 'rina@example.com',
    password: '$2a$10$hashedpasswordhere', // sudah di-hash!
  })

  // await Kategori.insertMany([
  //   { nama: 'Penanaman Pohon', icon: '🌳' },
  //   { nama: 'Daur Ulang', icon: '♻️' },
  //   { nama: 'Hemat Air', icon: '🚿' },
  // ])



  const user = await User.findOne({ email: 'fajry@gmail.com' })

  if (user) {
    const Aktivitas = mongoose.model('Aktivitas')

    await Aktivitas.create({
    user_id: user._id,
    title: 'Menanam 10 Pohon',
    description: 'Rina Hijau telah menanam 10 pohon di area taman kota.',
    kategori_id: (await Kategori.findOne({ nama: 'Penanaman Pohon' }))?._id,
    tanggal: new Date(),
    status: 'disetujui',
    })

    await Aktivitas.create({
    user_id: user._id,
    title: 'Mendaur Ulang Plastik',
    description: 'Rina Hijau mendaur ulang 5 kg plastik di pusat daur ulang.',
    kategori_id: (await Kategori.findOne({ nama: 'Daur Ulang' }))?._id,
    tanggal: new Date(),
    status: 'disetujui',
    })
  }



  console.log('✅ Dummy data berhasil diisi')
  process.exit()
}

seed()
