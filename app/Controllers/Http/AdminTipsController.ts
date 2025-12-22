import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Tips from 'App/Models/Tips'
import KategoriTips from 'App/Models/KategoriTips'
import { Application } from '@adonisjs/core/build/standalone'
import path from 'path'
import fs from 'fs'

export default class AdminTipsController {
  public async index({ view }: HttpContextContract) {
    try {
      // Get statistics
      const totalTips = await Tips.countDocuments()
      const publishedTips = await Tips.countDocuments({ status: 'published' })
      const draftTips = await Tips.countDocuments({ status: 'draft' })
      const totalViews = await Tips.aggregate([
        { $group: { _id: null, total: { $sum: "$views" } } }
      ])

      // Get all tips with populated categories
      const tips = await Tips.find()
        .populate('kategori')
        .sort('-createdAt')
        .lean()

      // Get all categories for filters
      const categories = await KategoriTips.find().lean()

      console.log('tips :', tips)

      return view.render('admin/tips', {
        stats: {
          total: totalTips,
          published: publishedTips,
          draft: draftTips,
          views: totalViews[0]?.total || 0
        },
        tips,
        categories
      })
    } catch (error) {
      console.error('Error loading admin tips:', error)
      return view.render('admin/tips', {
        stats: { total: 0, published: 0, draft: 0, views: 0 },
        tips: [],
        categories: [],
        error: 'Failed to load tips'
      })
    }
  }


  public async store({ request, response }: HttpContextContract) {
    try {
      // ✅ Validasi input
      const validationSchema = schema.create({
        judul: schema.string({}, [rules.maxLength(255)]),
        kategori_id: schema.string(),
        konten: schema.string(),
        dampak: schema.string.optional(),
        status: schema.string(),
        gambar: schema.file.optional({
          size: '2mb',
          extnames: ['jpg', 'png', 'jpeg'],
        }),
      })

      const payload = await request.validate({
        schema: validationSchema,
        messages: {
          'judul.required': 'Judul tips harus diisi',
          'kategori_id.required': 'Kategori harus dipilih',
          'konten.required': 'Konten tips harus diisi',
          'status.required': 'Status harus dipilih',
          'gambar.size': 'Ukuran gambar maksimal 2MB',
          'gambar.extname': 'Format gambar harus JPG, PNG, atau JPEG',
        },
      })

      let gambarPath = null

      // ✅ Upload gambar jika ada
      if (payload.gambar) {
        const uploadsDir = path.join(__dirname, '../../../public/uploads')

        // Buat folder jika belum ada
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true })
        }

        const fileName = `${Date.now()}.${payload.gambar.extname}`
        await payload.gambar.move(uploadsDir, {
          name: fileName,
          overwrite: true,
        })

        gambarPath = `/uploads/${fileName}`
      }

      // ✅ Dapatkan kategori berdasarkan kategori_id
      const kategori = await KategoriTips.findById(payload.kategori_id)
      if (!kategori) {
        return response.status(404).json({
          success: false,
          message: 'Kategori tidak ditemukan',
        })
      }

      // ✅ Simpan tips baru
      const tip = await Tips.create({
        judul: payload.judul,
        kategori: kategori,
        konten: payload.konten,
        dampak: payload.dampak,
        status: payload.status,
        gambar: gambarPath,
        views: 0,
      })

      // ✅ Populate kategori jika model mendukung populate
      if (tip.populate) {
        await tip.populate('kategori')
      }

      return response.status(201).json({
        success: true,
        message: 'Tips berhasil ditambahkan',
        data: tip,
      })

    } catch (error) {
      console.error('Error creating tip:', error)
      return response.status(400).json({
        success: false,
        message: error.messages || error.message,
      })
    }
  }

  public async getTips({ request, response }: HttpContextContract) {
    try {
      const { search, status, category, page = 1, limit = 10 } = request.qs()

      // Build query
      let query: any = {}

      // Add search filter
      if (search) {
        query.$or = [
          { judul: new RegExp(search, 'i') },
          { konten: new RegExp(search, 'i') }
        ]
      }

      // Add status filter
      if (status && status !== 'semua') {
        query.status = status
      }

      // Add category filter
      if (category && category !== 'semua') {
        query.kategori_id = category
      }

      // Get paginated tips
      const skip = (Number(page) - 1) * Number(limit)
      const tips = await Tips.find(query)
        .populate('kategori')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit))
        .lean()

      // Get total count for pagination
      const total = await Tips.countDocuments(query)

      // Get updated statistics
      const totalTips = await Tips.countDocuments()
      const publishedTips = await Tips.countDocuments({ status: 'publish' })
      const draftTips = await Tips.countDocuments({ status: 'draft' })
      const totalViews = await Tips.aggregate([
        { $group: { _id: null, total: { $sum: "$views" } } }
      ])

      return response.json({
        success: true,
        data: tips,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        },
        stats: {
          total: totalTips,
          published: publishedTips,
          draft: draftTips,
          views: totalViews[0]?.total || 0
        }
      })

    } catch (error) {
      console.error('Error fetching tips:', error)
      return response.status(500).json({
        success: false,
        message: 'Gagal mengambil data tips',
        error: error.message
      })
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const { id } = params
      const tip = await Tips.findById(id)

      if (!tip) {
        return response.status(404).json({
          success: false,
          message: 'Tips tidak ditemukan'
        })
      }

      // Validate input
      const validationSchema = schema.create({
        judul: schema.string({}, [rules.maxLength(255)]),
        kategori_id: schema.string(),
        konten: schema.string(),
        dampak: schema.string.optional(),
        status: schema.string(),
        gambar: schema.file.optional({
          size: '2mb',
          extnames: ['jpg', 'png', 'jpeg'],
        }),
      })

      const payload = await request.validate({
        schema: validationSchema,
        messages: {
          'judul.required': 'Judul tips harus diisi',
          'kategori_id.required': 'Kategori harus dipilih',
          'konten.required': 'Konten tips harus diisi',
          'status.required': 'Status harus dipilih',
        },
      })

      let gambarPath = tip.gambar

      // Handle new image upload if present
      if (payload.gambar) {
        // Delete old image if exists
        if (tip.gambar) {
          const oldPath = path.join(__dirname, '../../../public', tip.gambar)
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath)
          }
        }

        const uploadsDir = path.join(__dirname, '../../../public/uploads')
        const fileName = `${Date.now()}.${payload.gambar.extname}`
        await payload.gambar.move(uploadsDir, {
          name: fileName,
          overwrite: true,
        })
        gambarPath = `/uploads/${fileName}`
      }

      // Update tip
      const updatedTip = await Tips.findByIdAndUpdate(
        id,
        {
          judul: payload.judul,
          kategori: payload.kategori_id,
          konten: payload.konten,
          dampak: payload.dampak,
          status: payload.status,
          gambar: gambarPath,
        },
        { new: true }
      ).populate('kategori')

      return response.json({
        success: true,
        message: 'Tips berhasil diperbarui',
        data: updatedTip
      })

    } catch (error) {
      console.error('Error updating tip:', error)
      return response.status(400).json({
        success: false,
        message: error.messages || error.message
      })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const { id } = params
      const tip = await Tips.findById(id)

      if (!tip) {
        return response.status(404).json({
          success: false,
          message: 'Tips tidak ditemukan'
        })
      }

      // Delete image if exists
      if (tip.gambar) {
        const imagePath = path.join(__dirname, '../../../public', tip.gambar)
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath)
        }
      }

      // Use deleteOne() instead of delete()
      await Tips.deleteOne({ _id: id })

      return response.json({
        success: true,
        message: 'Tips berhasil dihapus'
      })

    } catch (error) {
      console.error('Error deleting tip:', error)
      return response.status(500).json({
        success: false,
        message: 'Gagal menghapus tips'
      })
    }
  }

  public async toggleStatus({ params, response }: HttpContextContract) {
    try {
      const { id } = params
      const tip = await Tips.findById(id)

      if (!tip) {
        return response.status(404).json({
          success: false,
          message: 'Tips tidak ditemukan'
        })
      }

      // Toggle the status
      let newStatus = tip.status === 'published' ? 'draft' : 'published'
       newStatus = tip.status === 'draft' ? 'published' : 'draft'
      // Update the status in the database
      console.log('Toggling status for tip:', id, 'from', tip.status, 'to', newStatus)
      // Update the tip
      const updatedTip = await Tips.findByIdAndUpdate(
        id,
        { status: newStatus },
        { new: true }
      ).populate('kategori')

      return response.json({
        success: true,
        message: 'Status tips berhasil diubah',
        data: updatedTip
      })

    } catch (error) {
      console.error('Error toggling tip status:', error)
      return response.status(500).json({
        success: false,
        message: 'Gagal mengubah status tips'
      })
    }
  }
}
