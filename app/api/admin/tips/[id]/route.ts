import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongodb'
import Tips from '@/lib/models/Tips'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// GET - Fetch single tip
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await connectDB()

        const tip = await Tips.findById(id).populate('kategori')
        if (!tip) {
            return NextResponse.json(
                { success: false, message: 'Tips tidak ditemukan' },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true, data: tip })
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        )
    }
}

// PUT - Update tip
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await connectDB()

        const tip = await Tips.findById(id)
        if (!tip) {
            return NextResponse.json(
                { success: false, message: 'Tips tidak ditemukan' },
                { status: 404 }
            )
        }

        const formData = await request.formData()
        const judul = formData.get('judul') as string
        const kategori_id = formData.get('kategori_id') as string
        const konten = formData.get('konten') as string
        const dampak = formData.get('dampak') as string
        const status = formData.get('status') as string
        const gambar = formData.get('gambar') as File | null

        let gambarPath = tip.gambar

        // Handle new image
        if (gambar && gambar.size > 0) {
            // Delete old image
            if (tip.gambar) {
                const oldPath = path.join(process.cwd(), 'public', tip.gambar)
                if (existsSync(oldPath)) {
                    await unlink(oldPath)
                }
            }

            const bytes = await gambar.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const uploadsDir = path.join(process.cwd(), 'public/uploads')
            if (!existsSync(uploadsDir)) {
                await mkdir(uploadsDir, { recursive: true })
            }

            const fileName = `${Date.now()}-${gambar.name}`
            const filePath = path.join(uploadsDir, fileName)
            await writeFile(filePath, buffer)
            gambarPath = `/uploads/${fileName}`
        }

        // Update tip
        const updatedTip = await Tips.findByIdAndUpdate(
            id,
            {
                judul: judul || tip.judul,
                kategori: kategori_id || tip.kategori,
                konten: konten || tip.konten,
                dampak: dampak || tip.dampak,
                status: status || tip.status,
                gambar: gambarPath
            },
            { new: true }
        ).populate('kategori')

        return NextResponse.json({
            success: true,
            message: 'Tips berhasil diperbarui',
            data: updatedTip
        })
    } catch (error: any) {
        console.error('Error updating tip:', error)
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 400 }
        )
    }
}

// DELETE - Delete tip
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await connectDB()

        const tip = await Tips.findById(id)
        if (!tip) {
            return NextResponse.json(
                { success: false, message: 'Tips tidak ditemukan' },
                { status: 404 }
            )
        }

        // Delete image if exists
        if (tip.gambar) {
            const imagePath = path.join(process.cwd(), 'public', tip.gambar)
            if (existsSync(imagePath)) {
                await unlink(imagePath)
            }
        }

        await Tips.deleteOne({ _id: id })

        return NextResponse.json({
            success: true,
            message: 'Tips berhasil dihapus'
        })
    } catch (error: any) {
        console.error('Error deleting tip:', error)
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        )
    }
}

// PATCH - Toggle status
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await connectDB()

        const tip = await Tips.findById(id)
        if (!tip) {
            return NextResponse.json(
                { success: false, message: 'Tips tidak ditemukan' },
                { status: 404 }
            )
        }

        const newStatus = tip.status === 'published' ? 'draft' : 'published'
        const updatedTip = await Tips.findByIdAndUpdate(
            id,
            { status: newStatus },
            { new: true }
        ).populate('kategori')

        return NextResponse.json({
            success: true,
            message: 'Status tips berhasil diubah',
            data: updatedTip
        })
    } catch (error: any) {
        console.error('Error toggling status:', error)
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        )
    }
}
