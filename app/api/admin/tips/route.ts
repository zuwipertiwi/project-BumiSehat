import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongodb'
import Tips from '@/lib/models/Tips'
import KategoriTips from '@/lib/models/Kategori'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// GET - Fetch all tips with filters
export async function GET(request: NextRequest) {
    try {
        await connectDB()

        const searchParams = request.nextUrl.searchParams
        const search = searchParams.get('search') || ''
        const status = searchParams.get('status') || 'semua'
        const category = searchParams.get('category') || 'semua'
        const page = parseInt(searchParams.get('page') || '1', 10)
        const limit = parseInt(searchParams.get('limit') || '10', 10)

        // Build query
        let query: any = {}

        if (search) {
            query.$or = [
                { judul: new RegExp(search, 'i') },
                { konten: new RegExp(search, 'i') }
            ]
        }

        if (status !== 'semua') {
            query.status = status
        }

        if (category !== 'semua') {
            query.kategori_id = category
        }

        const skip = (page - 1) * limit
        const tips = await Tips.find(query)
            .populate('kategori')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()

        const total = await Tips.countDocuments(query)

        const totalTips = await Tips.countDocuments()
        const publishedTips = await Tips.countDocuments({ status: 'published' })
        const draftTips = await Tips.countDocuments({ status: 'draft' })
        const totalViews = await Tips.aggregate([
            { $group: { _id: null, total: { $sum: '$views' } } }
        ])

        return NextResponse.json({
            success: true,
            data: tips,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            },
            stats: {
                total: totalTips,
                published: publishedTips,
                draft: draftTips,
                views: totalViews[0]?.total || 0
            }
        })
    } catch (error: any) {
        console.error('Error fetching tips:', error)
        return NextResponse.json(
            { success: false, message: 'Gagal mengambil data tips', error: error.message },
            { status: 500 }
        )
    }
}

// POST - Create new tip
export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const formData = await request.formData()
        const judul = formData.get('judul') as string
        const kategori_id = formData.get('kategori_id') as string
        const konten = formData.get('konten') as string
        const dampak = formData.get('dampak') as string
        const status = formData.get('status') as string
        const gambar = formData.get('gambar') as File | null

        // Validation
        if (!judul || !kategori_id || !konten || !status) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Judul, kategori, konten, dan status harus diisi'
                },
                { status: 400 }
            )
        }

        // Verify category exists
        const kategori = await KategoriTips.findById(kategori_id)
        if (!kategori) {
            return NextResponse.json(
                { success: false, message: 'Kategori tidak ditemukan' },
                { status: 404 }
            )
        }

        let gambarPath = null

        // Handle image upload
        if (gambar && gambar.size > 0) {
            const bytes = await gambar.arrayBuffer()
            const buffer = Buffer.from(bytes)

            // Create uploads directory if not exists
            const uploadsDir = path.join(process.cwd(), 'public/uploads')
            if (!existsSync(uploadsDir)) {
                await mkdir(uploadsDir, { recursive: true })
            }

            const fileName = `${Date.now()}-${gambar.name}`
            const filePath = path.join(uploadsDir, fileName)
            await writeFile(filePath, buffer)
            gambarPath = `/uploads/${fileName}`
        }

        // Create tip
        const tip = await Tips.create({
            judul,
            kategori: kategori_id,
            konten,
            dampak,
            status,
            gambar: gambarPath,
            views: 0
        })

        await tip.populate('kategori')

        return NextResponse.json(
            {
                success: true,
                message: 'Tips berhasil ditambahkan',
                data: tip
            },
            { status: 201 }
        )
    } catch (error: any) {
        console.error('Error creating tip:', error)
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 400 }
        )
    }
}
