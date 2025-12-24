import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongodb'
import Tips from '@/lib/models/Tips'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('📥 GET /api/tips/[id] - Fetch single tips:', id)

    await connectDB()
    
    // Increment views
    const tips = await Tips.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )

    if (!tips) {
      console.warn('⚠️ Tips not found:', id)
      return NextResponse.json(
        { success: false, message: 'Tips tidak ditemukan' },
        { status: 404 }
      )
    }

    console.log('✅ Tips found:', id)
    return NextResponse.json({
      success: true,
      data: tips
    })
  } catch (error) {
    console.error('❌ Error fetching tips:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data tips' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { judul, kategori, deskripsi, konten } = await request.json()

    console.log('✏️ PUT /api/tips/[id] - Update tips:', id)

    await connectDB()
    const tips = await Tips.findByIdAndUpdate(
      id,
      {
        judul: judul?.trim(),
        kategori: kategori?.trim(),
        deskripsi: deskripsi?.trim(),
        konten: konten?.trim()
      },
      { new: true }
    )

    if (!tips) {
      console.warn('⚠️ Tips not found:', id)
      return NextResponse.json(
        { success: false, message: 'Tips tidak ditemukan' },
        { status: 404 }
      )
    }

    console.log('✅ Tips updated:', id)
    return NextResponse.json({
      success: true,
      message: 'Tips berhasil diperbarui',
      data: tips
    })
  } catch (error) {
    console.error('❌ Error updating tips:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui tips' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('🗑️ DELETE /api/tips/[id] - Delete tips:', id)

    await connectDB()
    const tips = await Tips.findByIdAndDelete(id)

    if (!tips) {
      console.warn('⚠️ Tips not found:', id)
      return NextResponse.json(
        { success: false, message: 'Tips tidak ditemukan' },
        { status: 404 }
      )
    }

    console.log('✅ Tips deleted:', id)
    return NextResponse.json({
      success: true,
      message: 'Tips berhasil dihapus'
    })
  } catch (error) {
    console.error('❌ Error deleting tips:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus tips' },
      { status: 500 }
    )
  }
}
