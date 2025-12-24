// App/Controllers/Http/AktivitasController.ts
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Aktivitas from 'App/Models/Aktivitas'
import Kategori from 'App/Models/Kategori'
import User from 'App/Models/User'

export default class AktivitasController {

  // Menampilkan halaman aktivitas
  public async index({ view, currentUser }: HttpContextContract) {
    try {
      // Ambil semua kategori untuk dropdown
      const kategoriAktivitasRaw = await Kategori.find().sort({ nama: 1 })

      const kategoriAktivitas = kategoriAktivitasRaw.map(k => k.toObject ? k.toObject() : k)


      // Ambil aktivitas user yang sedang login
      const aktivitasUser = await Aktivitas.find({
        user_id: currentUser.id,
        status: { $ne: 'ditolak' }
      })
      .populate('kategori_id', 'nama icon')
      .sort({ tanggal: -1, createdAt: -1 })

      console.log('kategoriAktivitas: ', kategoriAktivitas);

      return view.render('aktivitas', {
        kategoriAktivitas,
        aktivitasUser: aktivitasUser || []
      })
    } catch (error) {
      console.error('Error loading aktivitas page:', error)
      return view.render('aktivitas', {
        kategoriAktivitas: [],
        aktivitasUser: [],
        error: 'Terjadi kesalahan saat memuat data aktivitas'
      })
    }
  }

  // API untuk mendapatkan aktivitas (untuk AJAX)
  public async getActivities({ request, response, currentUser }: HttpContextContract) {
    try {
      const { filter, sort, page = 1, limit = 10 } = request.qs()

      let query: any = {
        user_id: currentUser.id,
      }

      // Filter berdasarkan kategori
      if (filter && filter !== '') {
        const kategori = await Kategori.findOne({ nama: filter })
        if (kategori) {
          query.kategori_id = kategori._id
        }
      }

      let sortQuery: any = { tanggal: -1, createdAt: -1 }

      // Sorting
      switch(sort) {
        case 'oldest':
          sortQuery = { tanggal: 1, createdAt: 1 }
          break
        case 'type':
          // Akan di-sort setelah populate
          break
      }

      const skip = (parseInt(page) - 1) * parseInt(limit)

      let aktivitas = await Aktivitas.find(query)
        .populate('kategori_id', 'nama icon')
        .sort(sortQuery)
        .skip(skip)
        .limit(parseInt(limit))

      // Sort by type jika diperlukan
      if (sort === 'type') {
        aktivitas = aktivitas.sort((a, b) => {
          const nameA = a.kategori_id?.nama || ''
          const nameB = b.kategori_id?.nama || ''
          return nameA.localeCompare(nameB)
        })
      }

      const total = await Aktivitas.countDocuments(query)

      return response.json({
        success: true,
        data: aktivitas,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      })
    } catch (error) {
      console.error('Error getting activities:', error)
      return response.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data aktivitas'
      })
    }
  }

  // Menyimpan aktivitas baru
  public async store({ request, response, currentUser }: HttpContextContract) {
    try {
      const {
        jenis,
        tanggal,
        deskripsi,
        lokasi,
        manfaat
      } = request.only([
        'jenis',
        'tanggal',
        'deskripsi',
        'lokasi',
        'manfaat'
      ])

      // Ambil kategori_id dari jenis
      const Category = await Kategori.findOne({ nama: jenis })
      if (!Category) {
        return response.status(400).json({
          success: false,
          message: 'Kategori tidak ditemukan berdasarkan jenis yang diberikan'
        })
      }
      const kategori_id = Category._id

      // Validasi input
      const missingFields = [];
      if (!kategori_id) missingFields.push('kategori_id');
      if (!tanggal) missingFields.push('tanggal');
      if (!deskripsi) missingFields.push('deskripsi');
      if (!manfaat) missingFields.push('manfaat');

      if (missingFields.length > 0) {
        return response.status(400).json({
          success: false,
          message: `Field berikut wajib diisi: ${missingFields.join(', ')}`
        });
      }

      // Cek apakah kategori exists
      const kategori = await Kategori.findById(kategori_id)
      if (!kategori) {
        return response.status(400).json({
          success: false,
          message: 'Kategori tidak ditemukan'
        })
      }

      // Buat aktivitas baru
      const aktivitas = await Aktivitas.create({
        user_id: currentUser.id,
        kategori_id,
        tanggal: new Date(tanggal),
        deskripsi,
        lokasi: lokasi || '',
        manfaat,
        status: 'pending'
      })

      // Populate kategori untuk response
      await aktivitas.populate('kategori_id', 'nama icon')

      return response.json({
        success: true,
        message: 'Aktivitas berhasil disimpan dan menunggu persetujuan',
        data: aktivitas
      })

    } catch (error) {
      console.error('Error storing aktivitas:', error)
      return response.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat menyimpan aktivitas'
      })
    }
  }

  // Mendapatkan detail aktivitas
  public async show({ params, response, currentUser }: HttpContextContract) {
    try {
      const aktivitas = await Aktivitas.findOne({
        _id: params.id,
        user_id: currentUser.id
      }).populate('kategori_id', 'nama icon')

      if (!aktivitas) {
        return response.status(404).json({
          success: false,
          message: 'Aktivitas tidak ditemukan'
        })
      }

      return response.json({
        success: true,
        data: aktivitas
      })
    } catch (error) {
      console.error('Error getting aktivitas detail:', error)
      return response.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengambil detail aktivitas'
      })
    }
  }

  // Update aktivitas
  public async update({ params, request, response, currentUser }: HttpContextContract) {
    try {


      const aktivitas = await Aktivitas.findOne({
        _id: params.id,
        user_id: currentUser.id,
        status: { $ne: 'disetujui' } // Hanya bisa edit yang belum disetujui
      })

      if (!aktivitas) {
        return response.status(404).json({
          success: false,
          message: 'Aktivitas tidak ditemukan atau sudah disetujui'
        })
      }
      const {
        kategori_id,
        tanggal,
        deskripsi,
        lokasi,
        manfaat
      } = request.only([
        'kategori_id',
        'tanggal',
        'deskripsi',
        'lokasi',
        'manfaat'
      ])

      // Ambil kategori_id dari jenis
      const kategori = await Kategori.findOne({ nama: kategori_id })
      if (!kategori) {
        return response.status(400).json({
          success: false,
          message: 'Kategori tidak ditemukan berdasarkan jenis yang diberikan'
        })
      }
      const categori_id = kategori._id

      // Update aktivitas
      Object.assign(aktivitas, {
        kategori_id : categori_id,
        tanggal: new Date(tanggal),
        deskripsi,
        lokasi: lokasi || '',
        manfaat,
        status: 'pending' // Reset ke pending setelah di-edit
      })

      await aktivitas.save()
      await aktivitas.populate('kategori_id', 'nama icon')

      return response.json({
        success: true,
        message: 'Aktivitas berhasil diperbarui',
        data: aktivitas
      })

    } catch (error) {
      console.error('Error updating aktivitas:', error)
      return response.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat memperbarui aktivitas'
      })
    }
  }

  // Hapus aktivitas
  public async destroy({ params, response, currentUser }: HttpContextContract) {
    try {
      const aktivitas = await Aktivitas.findOne({
        _id: params.id,
        user_id: currentUser.id
      })

      if (!aktivitas) {
        return response.status(404).json({
          success: false,
          message: 'Aktivitas tidak ditemukan'
        })
      }

      await aktivitas.deleteOne()

      return response.json({
        success: true,
        message: 'Aktivitas berhasil dihapus'
      })

    } catch (error) {
      console.error('Error deleting aktivitas:', error)
      return response.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat menghapus aktivitas'
      })
    }
  }

  // Mendapatkan statistik aktivitas user
  public async getStats({ response, currentUser }: HttpContextContract) {
    try {
      const user = await User.findById(currentUser.id)
      if (!user) {
        return response.status(404).json({
          success: false,
          message: 'User tidak ditemukan'
        })
      }

      const stats = await user.getStats()

      // Tambahan statistik untuk hari ini dan minggu ini
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const todayEnd = new Date(today)
      todayEnd.setHours(23, 59, 59, 999)

      const todayCount = await Aktivitas.countDocuments({
        user_id: currentUser.id,
        status: 'disetujui',
        tanggal: { $gte: today, $lte: todayEnd }
      })

      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      weekAgo.setHours(0, 0, 0, 0)

      const weekCount = await Aktivitas.countDocuments({
        user_id: currentUser.id,
        status: 'disetujui',
        tanggal: { $gte: weekAgo }
      })

      return response.json({
        success: true,
        data: {
          ...stats,
          todayCount,
          weekCount
        }
      })

    } catch (error) {
      console.error('Error getting stats:', error)
      return response.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengambil statistik'
      })
    }
  }
}
