import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongodb'
import Tips from '@/lib/models/Tips'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// Clear mongoose cache
if (process.env.NODE_ENV === 'development') {
    if (require('mongoose').models.Tips) {
        delete require('mongoose').models.Tips
    }
}

// GET - Fetch all tips with filters
export async function GET(request: NextRequest) {
    try {
        await connectDB()

        const searchParams = request.nextUrl.searchParams
        const search = searchParams.get('search') || ''
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

        const skip = (page - 1) * limit
        const tips = await Tips.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const total = await Tips.countDocuments(query)

        return NextResponse.json({
            success: true,
            data: tips,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
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
        const konten = formData.get('konten') as string
        const deskripsi = formData.get('deskripsi') as string
        const kategori = formData.get('kategori') as string
        const penulis = formData.get('penulis') as string
        const gambar = formData.get('gambar') as File | null

        // Validation
        if (!judul || !konten) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Judul dan konten harus diisi'
                },
                { status: 400 }
            )
        }

        let fotoPath = null

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
            fotoPath = `/uploads/${fileName}`
        }

        // Create tip
        const tipDoc = new Tips({
            judul: judul || '',
            konten: konten || '',
            deskripsi: deskripsi?.toString() || '',
            kategori: kategori?.toString() || 'Umum',
            penulis: penulis?.toString() || 'Admin BumiSehat',
            foto: fotoPath,
            views: 0
        })

        const tip = await tipDoc.save()

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
