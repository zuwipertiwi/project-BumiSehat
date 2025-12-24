/*
|--------------------------------------------------------------------------
| Routes - BumiSehat Platform
|--------------------------------------------------------------------------
|
| BumiSehat adalah aplikasi edukatif dan pencatatan aktivitas ramah lingkungan
| yang fokus pada pelestarian tanah dan tumbuhan.
|
*/

import Route from '@ioc:Adonis/Core/Route'
import AuthController from 'App/Controllers/Http/AuthController'
import ProfilController from 'App/Controllers/Http/ProfilController'
import Aktivitas from 'App/Models/Aktivitas'
import Kategori from 'App/Models/Kategori'
import KategoriTips from 'App/Models/KategoriTips'
import Tips from 'App/Models/Tips'
import User from 'App/Models/User'
import { DateTime } from 'luxon'


// ====================
// PUBLIC ROUTES
// ====================

// Landing Page / Welcome - Halaman depan dengan info aplikasi
Route.get('/', async ({ view }) => {
  return view.render('welcome')
})

Route.get('/welcome', async ({ view }) => {
  return view.render('welcome')
})

// Authentication Routes
Route.get('/login', 'AuthController.showLogin')
Route.get('/register', 'AuthController.showRegister')

// Handle form login dan register
Route.post('/login', 'AuthController.login')
Route.post('/register', 'AuthController.register')

const kategoris = [
  { nama: 'Penanaman', icon: '🌳' },
  { nama: 'Pengelolaan Sampah', icon: '♻️' },
  { nama: 'Konservasi Air', icon: '💧' },
  { nama: 'Reduce Waste', icon: '🗑️' },
  { nama: 'Edukasi Lingkungan', icon: '📚' },
  { nama: 'Lainnya', icon: '🌱' }
]


Route.group(() => {
  Route.get('/dashboard', async ({ view, currentUser }) => {
    const user = currentUser

    if (!user) {
      return view.render('errors/unauthorized')
    }

    // Hari ini
    const today = DateTime.now().toFormat('yyyy-LL-dd')

    // Aktivitas hari ini
    const aktivitasHariIni = await Aktivitas
      .where('user_id', user._id)
      .where('tanggal', today)
      .countDocuments()

    // Total semua aktivitas
    const totalAktivitas = await Aktivitas
      .where('user_id', user._id)
      .countDocuments()

    // Ambil 5 aktivitas terbaru
    const aktivitasTerbaru = await Aktivitas
      .where('user_id', user._id)
      .sort({ tanggal: -1 })
      .limit(5)

    // Hitung aktivitas bulan ini untuk progress
    const bulanIni = DateTime.now().toFormat('yyyy-LL')
    const awalBulan = DateTime.now().startOf('month').toJSDate()
const akhirBulan = DateTime.now().endOf('month').toJSDate()
    const aktivitasBulanIni = await Aktivitas
      .where('user_id', user._id)
      .where('tanggal', { $gte: awalBulan, $lte: akhirBulan })
      .countDocuments()

    const targetBulanan = 30 // atau bisa diambil dari user.profile.target

    const progressBulanan = Math.min(100, Math.round((aktivitasBulanIni / targetBulanan) * 100))

    const todayTips = [
      'Gunakan tas belanja kain untuk mengurangi sampah plastik',
      'Pilih produk dengan kemasan minimal',
      'Manfaatkan air hujan untuk menyiram tanaman',
    ]

    const streakHari = await user.calculateStreak()

    return view.render('dashboard', {
      user,
      todayStats: {
        aktivitasHariIni,
        totalAktivitas,
        poinLingkungan: aktivitasHariIni * 10 // contoh per aktivitas 10 poin
      },
      aktivitasTerbaru,
      streakHari,
      progressBulanan,
      aktivitasBulanIni,
      targetBulanan,
      todayTips
    })
  })


    // Profil Routes
    Route.get('/profil', 'ProfilController.index')
    Route.get('/edit-profil', 'ProfilController.showEdit')
    Route.post('/edit-profil', 'ProfilController.update')

    // Aktivitas
    // Halaman aktivitas
    Route.get('/aktivitas', 'AktivitasController.index')

    // API untuk aktivitas
    Route.get('/api/aktivitas', 'AktivitasController.getActivities')
    Route.post('/api/aktivitas', 'AktivitasController.store')
    Route.get('/api/aktivitas/:id', 'AktivitasController.show')
    Route.put('/api/aktivitas/:id', 'AktivitasController.update')
    Route.delete('/api/aktivitas/:id', 'AktivitasController.destroy')

    // API untuk statistik
    Route.get('/api/aktivitas-stats', 'AktivitasController.getStats')

}).middleware('auth')


// Route.get('/login', async ({ view }) => {
//   return view.render('login')
// })

// Route.get('/register', async ({ view }) => {
//   return view.render('register')
// })

// // Authentication POST handlers
// Route.post('/login', async ({ request, response }) => {
//   const { email, password } = request.only(['email', 'password'])

//   try {
//     console.log('Login attempt:', { email })
//     // Redirect ke dashboard setelah login berhasil
//     return response.redirect('/dashboard')
//   } catch (error) {
//     console.log('Login gagal:', error.message)
//     return response.redirect().back()
//   }
// })

// Route.post('/register', async ({ request, response }) => {
//   const { name, email, password } = request.only(['name', 'email', 'password'])

//   try {
//     console.log('Register user:', { name, email })
//     // Redirect ke login setelah register berhasil
//     return response.redirect('/login')
//   } catch (error) {
//     console.log('Register gagal:', error.message)
//     return response.redirect().back()
//   }
// })

// ====================
// MAIN APPLICATION ROUTES
// ====================

// Dashboard - Ringkasan aktivitas & tips hari ini

// ====================
// AKTIVITAS ROUTES
// ====================

// Form Pencatatan Aktivitas
// Route.get('/aktivitas', async ({ view }) => {
//   const kategoriAktivitas = [
//     'Penanaman',
//     'Pengelolaan Sampah',
//     'Konservasi Air',
//     'Reduce Waste',
//     'Edukasi Lingkungan',
//     'Lainnya'
//   ]

//   return view.render('aktivitas', { kategoriAktivitas })
// })

// Simpan Aktivitas Baru
Route.post('/aktivitas', async ({ request, response }) => {
  const data = request.only(['nama', 'tanggal', 'kategori', 'deskripsi', 'lokasi'])


  console.log('Aktivitas baru:', data)

  return response.redirect('/aktivitas-detail', )
})

// Detail Aktivitas - Lihat semua aktivitas yang pernah dicatat
Route.get('/aktivitas-detail', async ({ view }) => {
  const user = { name: 'Indri' }

  const aktivitasList = [
    {
      id: 1,
      nama: 'Menanam pohon mangga',
      tanggal: '2025-05-25',
      kategori: 'Penanaman',
      deskripsi: 'Menanam 5 bibit pohon mangga di halaman belakang',
      lokasi: 'Halaman Rumah'
    },
    {
      id: 2,
      nama: 'Mengompos sampah organik',
      tanggal: '2025-05-24',
      kategori: 'Pengelolaan Sampah',
      deskripsi: 'Membuat kompos dari sisa sayuran dan buah-buahan',
      lokasi: 'Dapur'
    },
    {
      id: 3,
      nama: 'Mengurangi penggunaan plastik',
      tanggal: '2025-05-23',
      kategori: 'Reduce Waste',
      deskripsi: 'Menggunakan tumbler dan tas kain saat berbelanja',
      lokasi: 'Pasar Tradisional'
    }
  ]

  const kategoriAktivitasRaw = await Kategori.find().sort({ nama: 1 })

    const kategoriAktivitas = kategoriAktivitasRaw.map(k => k.toObject ? k.toObject() : k)

  return view.render('aktivitas-detail', { user, aktivitasList, kategoriAktivitas })
})

// ====================
// PROFIL ROUTES
// ====================

// Profil User
// Route.get('/profil', async ({ view }) => {
//   const user = {
//     name: 'Indri',
//     email: 'alfi240404@gmail.com',
//     avatar: '/images/default-avatar.jpg',
//     joinDate: '2025-01-15'
//   }

//   const profilStats = {
//     totalAktivitas: 45,
//     totalPoin: 245,
//     ranking: 'Eco Warrior',
//     streak: 7
//   }

//   const recentAktivitas = [
//     { nama: 'Menanam pohon mangga', tanggal: '2025-05-25' },
//     { nama: 'Mengompos sampah organik', tanggal: '2025-05-24' },
//     { nama: 'Mengurangi penggunaan plastik', tanggal: '2025-05-23' }
//   ]

//   return view.render('profil', { user, profilStats, recentAktivitas })
// })

// // Form Edit Profil
// Route.get('/edit-profil', async ({ view }) => {
//   const user = {
//     name: 'Indri',
//     email: 'alfi240404@gmail.com',
//     avatar: '/images/default-avatar.jpg'
//   }

//   return view.render('edit-profil', { user })
// })

// // Update Profil
// Route.post('/edit-profil', async ({ request, response }) => {
//   const data = request.only(['name', 'email', 'password'])

//   console.log('Update profil:', data)

//   return response.redirect('/profil')
// })

// Logout
Route.get('/logout', 'AuthController.logout')

// ====================
// TIPS & EDUKASI ROUTES
// ====================

// Tips Lingkungan - Daftar tips harian dan kategori
// Replace the existing /tips route with:
Route.get('/tips', async ({ view }) => {
  try {
    // Get all published tips and populate their categories
    const tips = await Tips.find({ status: 'published' })
      .populate('kategori')
      .sort('-createdAt')
      .lean()

    // Get the most recent tip for tipHarian
    const latestTip = tips[0]
    const tipHarian = latestTip ? {
      tanggal: latestTip.createdAt,
      tip: latestTip.konten.substring(0, 200) + '...',
      judul: latestTip.judul
    } : null

    // Group tips by category
    const tipsByCategory = tips.reduce((acc, tip) => {
      const categoryName = tip.kategori?.nama || 'Lainnya'

      if (!acc[categoryName]) {
        acc[categoryName] = []
      }

      acc[categoryName].push({
        id: tip._id,
        judul: tip.judul,
        preview: tip.konten.substring(0, 100) + '...',
        gambar: tip.gambar,
        dampak: tip.dampak
      })

      return acc
    }, {})

    return view.render('tips', { tipsByCategory, tipHarian })
  } catch (error) {
    console.error('Error loading tips:', error)
    return view.render('tips', {
      tipsByCategory: {},
      tipHarian: null,
      error: 'Gagal memuat tips'
    })
  }
})

// Detail Tips
// Detail Tips Route
Route.get('/tips/:id', async ({ params, view }) => {
  try {
    // Fetch the tip and populate its category
    const tip = await Tips.findById(params.id)
      .populate('kategori')
      .lean()



      console.log(tip)

    if (!tip?._id) {
      return view.render('errors/not-found')
    }

    // Get related tips from the same category
    const relatedTips = await Tips.find({
      kategori: tip.kategori,
      _id: { $ne: tip._id },
      status: 'published'
    })
    .limit(3)
    .populate('kategori')
    .lean()

    // Calculate reading time (assume 200 words per minute)
    const wordCount = tip.konten.split(' ').length
    const readingTime = Math.ceil(wordCount / 200)

    return view.render('tips-detail', {
      tip: {
        ...tip,
        readingTime,
        formattedDate: new Date(tip.createdAt).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      },
      relatedTips
    })
  } catch (error) {
    console.error('Error loading tip detail:', error)
    return view.render('errors/not-found')
  }
})

// Edukasi / Artikel - Daftar artikel edukatif
Route.get('/edukasi', async ({ view }) => {
  const artikelList = [
    {
      id: 1,
      judul: 'Pentingnya Pelestarian Tanah untuk Masa Depan',
      kategori: 'Konservasi Tanah',
      tanggal: '2025-05-20',
      preview: 'Tanah adalah sumber daya vital yang perlu dijaga untuk keberlanjutan generasi mendatang...',
      gambar: '/images/artikel-tanah.jpg',
      author: 'Tim BumiSehat'
    },
    {
      id: 2,
      judul: 'Peran Tumbuhan dalam Ekosistem',
      kategori: 'Konservasi Tumbuhan',
      tanggal: '2025-05-18',
      preview: 'Tumbuhan memiliki peran krusial dalam menjaga keseimbangan ekosistem dan kehidupan...',
      gambar: '/images/artikel-tumbuhan.jpg',
      author: 'Dr. Budi Santoso'
    },
    {
      id: 3,
      judul: 'Dampak Perubahan Iklim terhadap Pertanian',
      kategori: 'Perubahan Iklim',
      tanggal: '2025-05-15',
      preview: 'Perubahan iklim memberikan tantangan besar bagi sektor pertanian dan ketahanan pangan...',
      gambar: '/images/artikel-iklim.jpg',
      author: 'Prof. Sari Wijaya'
    }
  ]

  const kategoriArtikel = [
    'Konservasi Tanah',
    'Konservasi Tumbuhan',
    'Perubahan Iklim',
    'Teknologi Hijau',
    'Pertanian Berkelanjutan'
  ]

  return view.render('edukasi', { artikelList, kategoriArtikel })
})

// Detail Edukasi - Tampilan artikel lengkap
Route.get('/edukasi/:id', async ({ params, view }) => {
  const artikelData = {
    1: {
      judul: 'Pentingnya Pelestarian Tanah untuk Masa Depan',
      kategori: 'Konservasi Tanah',
      tanggal: '2025-05-20',
      author: 'Tim BumiSehat',
      gambar: '/images/artikel-tanah.jpg',
      konten: `
        Tanah adalah salah satu sumber daya alam yang paling berharga di planet ini.
        Pelestarian tanah menjadi kunci utama untuk menjamin keberlanjutan kehidupan
        generasi mendatang.

        Mengapa Tanah Penting?
        Tanah berperan sebagai media tumbuh tanaman, menyaring air, dan menyimpan karbon.

        Ancaman terhadap Tanah:
        - Erosi akibat aktivitas manusia
        - Pencemaran dari limbah industri
        - Penggunaan pestisida berlebihan

        Cara Melestarikan Tanah:
        - Praktik pertanian berkelanjutan
        - Pencegahan erosi dengan tanaman penutup
        - Penggunaan pupuk organik
        - Sistem terasering di lahan miring
      `,
      tags: ['tanah', 'konservasi', 'pertanian', 'lingkungan']
    },
    2: {
      judul: 'Peran Tumbuhan dalam Ekosistem',
      kategori: 'Konservasi Tumbuhan',
      tanggal: '2025-05-18',
      author: 'Dr. Budi Santoso',
      gambar: '/images/artikel-tumbuhan.jpg',
      konten: `
        Tumbuhan memiliki peran yang sangat vital dalam menjaga keseimbangan ekosistem
        dan mendukung kehidupan semua makhluk hidup di bumi.

        Peran Utama Tumbuhan:
        - Produsen oksigen melalui fotosintesis
        - Penyerap karbon dioksida dari atmosfer
        - Habitat bagi berbagai jenis hewan
        - Sumber makanan dan obat-obatan

        Ancaman terhadap Tumbuhan:
        - Deforestasi dan alih fungsi lahan
        - Perubahan iklim global
        - Pencemaran lingkungan

        Upaya Konservasi:
        - Reboisasi dan penghijauan
        - Konservasi in-situ dan ex-situ
        - Edukasi pentingnya tumbuhan
        - Pengembangan taman botani
      `,
      tags: ['tumbuhan', 'ekosistem', 'konservasi', 'fotosintesis']
    }
  }

  const artikel = artikelData[params.id]

  if (!artikel) {
    return view.render('errors/not-found')
  }

  const artikelTerkait = [
    { id: 1, judul: 'Pentingnya Pelestarian Tanah untuk Masa Depan' },
    { id: 3, judul: 'Dampak Perubahan Iklim terhadap Pertanian' }
  ].filter(a => a.id != params.id)

  return view.render('edukasi-detail', { artikel, artikelTerkait })
})

// ====================
// ADMIN ROUTES
// ====================

// Admin Login - Halaman login khusus admin
Route.get('/admin/login', async ({ view }) => {
  return view.render('admin/login')
})

// Admin Login POST - Proses login admin
Route.post('/admin/login', async ({ request, response, session }) => {
  const { admin_id, password } = request.only(['admin_id', 'password'])
  console.log('Admin login attempt:', { admin_id })
  try {
    // In production, use proper authentication with hashed passwords
    if (admin_id === 'admin@gmail.com' && password === 'admin123') {
      session.put('isAdmin', true)
      console.log('Admin login successful:', admin_id)
      return response.redirect('/admin')
    }

    console.log('Admin login successful:', admin_id)
    session.flash({ error: 'Invalid credentials' })
    return response.redirect().back()
  } catch (error) {

    console.error('Admin login error:', error)
    session.flash({ error: 'Server error' })
    return response.redirect().back()
  }
})

// Admin middleware
const adminMiddleware = async ({ response, session }, next) => {
  const isAdmin = session.get('isAdmin')

  if (!isAdmin) {
    return response.redirect('/login')
  }

  await next()
}

// Add this helper function
async function getAdminStats() {
  // Get total users
  const totalPengguna = await User.countDocuments()

  // Get total activities
  const totalAktivitas = await Aktivitas.countDocuments()

  // Get total tips
  const totalTips = await Tips.countDocuments()

  // Get total articles (static since not implemented)
  const totalArtikel = 28

  // Get today's activities
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const aktivitasHariIni = await Aktivitas.countDocuments({
    createdAt: { $gte: today }
  })

  // Get active users (users with activity in last 7 days)
  const lastWeek = new Date()
  lastWeek.setDate(lastWeek.getDate() - 7)
  const penggunaAktif = await Aktivitas.distinct('user_id', {
    createdAt: { $gte: lastWeek }
  }).then(users => users.length)

  return {
    totalPengguna,
    totalAktivitas,
    totalTips,
    totalArtikel,
    aktivitasHariIni,
    penggunaAktif
  }
}

// Group admin routes
Route.group(() => {
  Route.get('/admin', async ({ view }) => {
    try {
      const adminStats = await getAdminStats()

      // Get recent activities
      const recentActivities = await Aktivitas.find()
        .populate('user_id', 'name')
        .populate('kategori_id', 'nama')
        .sort({ createdAt: -1 })
        .limit(3)
        .lean()
        .then(activities => activities.map(act => ({
          username: act.user_id?.name || 'Unknown',
          aktivitas: act.deskripsi,
          tanggal: new Date(act.createdAt).toLocaleDateString('id-ID'),
          kategori: act.kategori_id?.nama || 'Uncategorized',
          status: act.status
        })))

      return view.render('admin/dashboard', {
        adminStats,
        recentActivities
      })

    } catch (error) {
      console.error('Error loading admin dashboard:', error)
      return view.render('admin/dashboard', {
        adminStats: {
          totalPengguna: 0,
          totalAktivitas: 0,
          totalTips: 0,
          totalArtikel: 0,
          aktivitasHariIni: 0,
          penggunaAktif: 0
        },
        recentActivities: [],
        error: 'Gagal memuat data dashboard'
      })
    }
  })

  Route.get('/admin/aktivitas', async ({ view }) => {
    try {
      // Get activity stats
      const stats = {
        total: await Aktivitas.countDocuments(),
        pending: await Aktivitas.countDocuments({ status: 'pending' }),
        approved: await Aktivitas.countDocuments({ status: 'disetujui' }),
        rejected: await Aktivitas.countDocuments({ status: 'ditolak' }),
        today: await Aktivitas.countDocuments({
          createdAt: {
            $gte: new Date().setHours(0,0,0,0)
          }
        })
      }

      // Get activities with populated user and category data
      const aktivitasList = await Aktivitas.find()
        .populate('user_id', 'name email')
        .populate('kategori_id', 'nama icon')
        .sort({ createdAt: -1 })
        .lean()
        .then(activities => activities.map(act => ({
          id: act._id,
          username: act.user_id?.name || 'Unknown',
          email: act.user_id?.email || '-',
          aktivitas: act.deskripsi,
          tanggal: new Date(act.tanggal).toLocaleDateString('id-ID'),
          kategori: act.kategori_id?.nama || 'Uncategorized',
          icon: act.kategori_id?.icon || '🌱',
          deskripsi: act.deskripsi,
          lokasi: act.lokasi || '-',
          status: act.status,
          manfaat: act.manfaat || '-',
          alasan_penolakan: act.alasan_penolakan
        })))

      // Get categories for filter
      const categories = await Kategori.find().sort({ nama: 1 })

      const filterOptions = {
        kategori: ['Semua', ...categories.map(k => k.nama)],
        status: ['Semua', 'pending', 'disetujui', 'ditolak']
      }

      return view.render('admin/aktivitas', {
        aktivitasList,
        filterOptions,
        stats
      })

    } catch (error) {
      console.error('Error loading activities:', error)
      return view.render('admin/aktivitas', {
        aktivitasList: [],
        filterOptions: {
          kategori: ['Semua'],
          status: ['Semua', 'pending', 'disetujui', 'ditolak']
        },
        stats: {
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          today: 0
        },
        error: 'Gagal memuat data aktivitas'
      })
    }
  })

  // Add route to handle status updates
  Route.put('/admin/aktivitas/:id/status', async ({ params, request, response }) => {
    try {
      const { status, alasan_penolakan } = request.only(['status', 'alasan_penolakan'])

      const aktivitas = await Aktivitas.findByIdAndUpdate(
        params.id,
        {
          status,
          ...(alasan_penolakan ? { alasan_penolakan } : {})
        },
        { new: true }
      ).populate('user_id').populate('kategori_id')

      if (!aktivitas) {
        return response.status(404).json({
          success: false,
          message: 'Aktivitas tidak ditemukan'
        })
      }

      return response.json({
        success: true,
        message: `Aktivitas berhasil ${status === 'disetujui' ? 'disetujui' : 'ditolak'}`,
        data: aktivitas
      })

    } catch (error) {
      console.error('Error updating activity status:', error)
      return response.status(500).json({
        success: false,
        message: 'Gagal memperbarui status aktivitas'
      })
    }
  })

  Route.get('/admin/aktivitas/:id', async ({ params, response }) => {
    try {
      const aktivitas = await Aktivitas.findById(params.id)
        .populate('user_id', 'name email')
        .populate('kategori_id', 'nama icon')
        .lean()

      if (!aktivitas) {
        return response.status(404).json({
          success: false,
          message: 'Aktivitas tidak ditemukan'
        })
      }

      return response.json(aktivitas)

    } catch (error) {
      console.error('Error getting activity details:', error)
      return response.status(500).json({
        success: false,
        message: 'Gagal memuat detail aktivitas'
      })
    }
  })

  Route.put('/admin/aktivitas/:id/reactivate', async ({ params, response }) => {
    try {
      const aktivitas = await Aktivitas.findByIdAndUpdate(
        params.id,
        {
          status: 'pending',
          alasan_penolakan: null // Clear rejection reason
        },
        { new: true }
      ).populate('user_id').populate('kategori_id')

      if (!aktivitas) {
        return response.status(404).json({
          success: false,
          message: 'Aktivitas tidak ditemukan'
        })
      }

      return response.json({
        success: true,
        message: 'Aktivitas berhasil diaktifkan kembali',
        data: aktivitas
      })

    } catch (error) {
      console.error('Error reactivating activity:', error)
      return response.status(500).json({
        success: false,
        message: 'Gagal mengaktifkan aktivitas'
      })
    }
  })

  // Add this inside admin routes group
  Route.put('/admin/aktivitas/:id/revoke', async ({ params, response }) => {
    try {
      const aktivitas = await Aktivitas.findByIdAndUpdate(
        params.id,
        {
          status: 'pending',
          alasan_penolakan: null // Clear any rejection reason
        },
        { new: true }
      ).populate('user_id').populate('kategori_id')

      if (!aktivitas) {
        return response.status(404).json({
          success: false,
          message: 'Aktivitas tidak ditemukan'
        })
      }

      return response.json({
        success: true,
        message: 'Status aktivitas berhasil direset ke pending',
        data: aktivitas
      })

    } catch (error) {
      console.error('Error revoking activity:', error)
      return response.status(500).json({
        success: false,
        message: 'Gagal mereset status aktivitas'
      })
    }
  })

  Route.get('/admin/edukasi', async ({ view }) => {
    const artikelList = [
      {
        id: 1,
        judul: 'Pentingnya Pelestarian Tanah untuk Masa Depan',
        kategori: 'Konservasi Tanah',
        tanggal: '2025-05-20',
        author: 'Tim BumiSehat',
        status: 'Published',
        views: 423,
        likes: 67
      },
      {
        id: 2,
        judul: 'Peran Tumbuhan dalam Ekosistem',
        kategori: 'Konservasi Tumbuhan',
        tanggal: '2025-05-18',
        author: 'Dr. Budi Santoso',
        status: 'Published',
        views: 356,
        likes: 89
      },
      {
        id: 3,
        judul: 'Dampak Perubahan Iklim terhadap Pertanian',
        kategori: 'Perubahan Iklim',
        tanggal: '2025-05-15',
        author: 'Prof. Sari Wijaya',
        status: 'Draft',
        views: 0,
        likes: 0
      },
      {
        id: 4,
        judul: 'Teknologi Hijau untuk Masa Depan',
        kategori: 'Teknologi Hijau',
        tanggal: '2025-05-12',
        author: 'Tim BumiSehat',
        status: 'Published',
        views: 298,
        likes: 45
      }
    ]

    const kategoriArtikel = [
      'Konservasi Tanah',
      'Konservasi Tumbuhan',
      'Perubahan Iklim',
      'Teknologi Hijau',
      'Pertanian Berkelanjutan'
    ]

    return view.render('admin/edukasi', { artikelList, kategoriArtikel })
  })
}).middleware(adminMiddleware)

// Admin Dashboard - Replace the existing route

// Admin Kelola Aktivitas - Melihat semua aktivitas pengguna
// Route.get('/admin/aktivitas', async ({ view }) => {
//   const aktivitasList = [
//     {
//       id: 1,
//       username: 'Indri',
//       email: 'alfi240404@gmail.com',
//       aktivitas: 'Menanam pohon mangga',
//       tanggal: '2025-05-25',
//       kategori: 'Penanaman',
//       deskripsi: 'Menanam 5 bibit pohon mangga di halaman belakang',
//       lokasi: 'Halaman Rumah',
//       status: 'Verified',
//       poin: 15
//     },
//     {
//       id: 2,
//       username: 'Budi Santoso',
//       email: 'budi@email.com',
//       aktivitas: 'Mengompos sampah organik',
//       tanggal: '2025-05-25',
//       kategori: 'Pengelolaan Sampah',
//       deskripsi: 'Membuat kompos dari sisa sayuran dan buah-buahan',
//       lokasi: 'Dapur',
//       status: 'Pending',
//       poin: 10
//     },
//     {
//       id: 3,
//       username: 'Sari Wijaya',
//       email: 'sari@email.com',
//       aktivitas: 'Mengurangi penggunaan plastik',
//       tanggal: '2025-05-24',
//       kategori: 'Reduce Waste',
//       deskripsi: 'Menggunakan tumbler dan tas kain saat berbelanja',
//       lokasi: 'Pasar Tradisional',
//       status: 'Verified',
//       poin: 8
//     },
//     {
//       id: 4,
//       username: 'Andi Kurniawan',
//       email: 'andi@email.com',
//       aktivitas: 'Edukasi lingkungan ke tetangga',
//       tanggal: '2025-05-23',
//       kategori: 'Edukasi Lingkungan',
//       deskripsi: 'Memberikan penyuluhan tentang pentingnya menjaga lingkungan',
//       lokasi: 'RT 05',
//       status: 'Rejected',
//       poin: 0
//     }
//   ]

//   const filterOptions = {
//     kategori: ['Semua', 'Penanaman', 'Pengelolaan Sampah', 'Konservasi Air', 'Reduce Waste', 'Edukasi Lingkungan'],
//     status: ['Semua', 'Pending', 'Verified', 'Rejected']
//   }

//   return view.render('admin/aktivitas', { aktivitasList, filterOptions })
// })

// Admin Update Status Aktivitas
Route.post('/admin/aktivitas/:id/status', async ({ params, request, response }) => {
  const { status } = request.only(['status'])

  console.log(`Update aktivitas ${params.id} status menjadi: ${status}`)

  return response.redirect('/admin/aktivitas')
})

// Admin Kelola Tips - Melihat, menambah, edit, hapus tips
// Replace existing tips routes with:
Route.get('admin/tips', 'AdminTipsController.index')
Route.get('admin/tips/:id', 'AdminTipsController.show')

Route.group(() => {
  Route.get('/tips', 'AdminTipsController.getTips')
  Route.get('/tips/:id', 'AdminTipsController.getTips')
  Route.post('/tips', 'AdminTipsController.store')
  Route.put('/tips/:id', 'AdminTipsController.update')
  Route.delete('/tips/:id', 'AdminTipsController.destroy')
  Route.put('/tips/:id/status', 'AdminTipsController.toggleStatus')


}).prefix('/api/admin')

// Route.get('/admin/tips', async ({ view }) => {
//   // Ambil semua tips, populate kategori
//   const tips = await Tips.find().populate('kategori').lean()

//   // Format ulang data agar cocok dengan struktur tampilan
//   const tipsList = tips.map((tip) => ({
//     id: tip._id,
//     judul: tip.judul,
//     kategori: tip.kategori?.nama || 'Tidak Diketahui',
//     tanggal: tip.createdAt.toISOString().split('T')[0],
//     status: tip.status === 'publish' ? 'Published' : 'Draft',
//     views: 0, // Jika belum ada field views, set default 0
//     author: 'Admin', // Anda bisa ambil dari user login kalau tersedia
//   }))

//   // Ambil semua kategori
//   const kategoriData = await KategoriTips.find().lean()
//   const kategoriTips = kategoriData.map((kategori) => kategori.nama)

//   return view.render('admin/tips', { tipsList, kategoriTips })
// })

// Admin Form Tambah Tips
Route.get('/admin/tips/tambah', async ({ view }) => {
  const kategoriTips = [
    'Penghematan Air',
    'Pengelolaan Sampah',
    'Konservasi Tanah',
    'Konservasi Tumbuhan',
    'Teknologi Hijau'
  ]

  return view.render('admin/tips-form', { kategoriTips, isEdit: false })
})

// Admin Form Edit Tips
Route.get('/admin/tips/:id/edit', async ({ params, view }) => {
  const tipsData = {
    1: {
      id: 1,
      judul: 'Cara Efektif Menghemat Air di Rumah',
      kategori: 'Penghematan Air',
      konten: 'Konten lengkap tips menghemat air di rumah dengan berbagai cara praktis dan mudah diterapkan.',
      gambar: '/images/tips-hemat-air.jpg',
      status: 'Published'
    }
  }

  const tips = tipsData[params.id]
  const kategoriTips = [
    'Penghematan Air',
    'Pengelolaan Sampah',
    'Konservasi Tanah',
    'Konservasi Tumbuhan',
    'Teknologi Hijau'
  ]

  return view.render('admin/tips-form', { tips, kategoriTips, isEdit: true })
})

// Admin Simpan Tips
Route.post('/admin/tips', async ({ request, response }) => {
  const data = request.only(['judul', 'kategori', 'konten', 'gambar', 'status'])

  console.log('Tips baru:', data)

  return response.redirect('/admin/tips')
})

// Admin Update Tips
Route.put('/admin/tips/:id', async ({ params, request, response }) => {
  const data = request.only(['judul', 'kategori', 'konten', 'gambar', 'status'])

  console.log(`Update tips ${params.id}:`, data)

  return response.redirect('/admin/tips')
})

// Admin Hapus Tips
Route.delete('/admin/tips/:id', async ({ params, response }) => {
  console.log(`Hapus tips ${params.id}`)

  return response.redirect('/admin/tips')
})

// Admin Kelola Edukasi - Melihat, menambah, edit, hapus artikel


// Admin Form Tambah Artikel Edukasi
Route.get('/admin/edukasi/tambah', async ({ view }) => {
  const kategoriArtikel = [
    'Konservasi Tanah',
    'Konservasi Tumbuhan',
    'Perubahan Iklim',
    'Teknologi Hijau',
    'Pertanian Berkelanjutan'
  ]

  return view.render('admin/edukasi-form', { kategoriArtikel, isEdit: false })
})

// Admin Form Edit Artikel Edukasi
Route.get('/admin/edukasi/:id/edit', async ({ params, view }) => {
  const artikelData = {
    1: {
      id: 1,
      judul: 'Pentingnya Pelestarian Tanah untuk Masa Depan',
      kategori: 'Konservasi Tanah',
      author: 'Tim BumiSehat',
      konten: 'Konten lengkap artikel tentang pelestarian tanah...',
      gambar: '/images/artikel-tanah.jpg',
      tags: 'tanah,konservasi,pertanian,lingkungan',
      status: 'Published'
    }
  }

  const artikel = artikelData[params.id]
  const kategoriArtikel = [
    'Konservasi Tanah',
    'Konservasi Tumbuhan',
    'Perubahan Iklim',
    'Teknologi Hijau',
    'Pertanian Berkelanjutan'
  ]

  return view.render('admin/edukasi-form', { artikel, kategoriArtikel, isEdit: true })
})

// Admin Simpan Artikel Edukasi
Route.post('/admin/edukasi', async ({ request, response }) => {
  const data = request.only(['judul', 'kategori', 'author', 'konten', 'gambar', 'tags', 'status'])

  console.log('Artikel baru:', data)

  return response.redirect('/admin/edukasi')
})

// Admin Update Artikel Edukasi
Route.put('/admin/edukasi/:id', async ({ params, request, response }) => {
  const data = request.only(['judul', 'kategori', 'author', 'konten', 'gambar', 'tags', 'status'])

  console.log(`Update artikel ${params.id}:`, data)

  return response.redirect('/admin/edukasi')
})

// Admin Hapus Artikel Edukasi
Route.delete('/admin/edukasi/:id', async ({ params, response }) => {
  console.log(`Hapus artikel ${params.id}`)

  return response.redirect('/admin/edukasi')
})

// Admin Logout
Route.get('/admin/logout', async ({ response, session }) => {
  session.forget('isAdmin') // Remove admin session
  console.log('Admin logout')
  return response.redirect('/')
})
