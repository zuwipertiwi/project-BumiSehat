import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongodb'
import Aktivitas from '@/lib/models/Aktivitas'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('📥 GET /api/aktivitas/[id] - Fetch single aktivitas:', id)

    await connectDB()
    const aktivitas = await Aktivitas.findById(id)

    if (!aktivitas) {
      console.warn('⚠️ Aktivitas not found:', id)
      return NextResponse.json(
        { success: false, message: 'Aktivitas tidak ditemukan' },
        { status: 404 }
      )
    }

    console.log('✅ Aktivitas found:', id)
    return NextResponse.json({
      success: true,
      data: aktivitas
    })
  } catch (error) {
    console.error('❌ Error fetching aktivitas:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data aktivitas' },
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
    const { judul, deskripsi, dampak, kategori } = await request.json()

    console.log('✏️ PUT /api/aktivitas/[id] - Update aktivitas:', id)

    await connectDB()
    const aktivitas = await Aktivitas.findByIdAndUpdate(
      id,
      {
        judul: judul?.trim(),
        deskripsi: deskripsi?.trim(),
        dampak: dampak?.trim(),
        kategori: kategori?.trim()
      },
      { new: true }
    )

    if (!aktivitas) {
      console.warn('⚠️ Aktivitas not found:', id)
      return NextResponse.json(
        { success: false, message: 'Aktivitas tidak ditemukan' },
        { status: 404 }
      )
    }

    console.log('✅ Aktivitas updated:', id)
    return NextResponse.json({
      success: true,
      message: 'Aktivitas berhasil diperbarui',
      data: aktivitas
    })
  } catch (error) {
    console.error('❌ Error updating aktivitas:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui aktivitas' },
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
    console.log('🗑️ DELETE /api/aktivitas/[id] - Delete aktivitas:', id)

    await connectDB()
    const aktivitas = await Aktivitas.findByIdAndDelete(id)

    if (!aktivitas) {
      console.warn('⚠️ Aktivitas not found:', id)
      return NextResponse.json(
        { success: false, message: 'Aktivitas tidak ditemukan' },
        { status: 404 }
      )
    }

    console.log('✅ Aktivitas deleted:', id)
    return NextResponse.json({
      success: true,
      message: 'Aktivitas berhasil dihapus'
    })
  } catch (error) {
    console.error('❌ Error deleting aktivitas:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus aktivitas' },
      { status: 500 }
    )
  }
}
