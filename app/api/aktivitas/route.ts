import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongodb'
import Aktivitas from '@/lib/models/Aktivitas'
import User from '@/lib/models/User'

export async function GET(request: NextRequest) {
  try {
    console.log('📥 GET /api/aktivitas - Fetch all aktivitas')

    await connectDB()
    const aktivitas = await Aktivitas.find().sort({ createdAt: -1 })

    console.log(`✅ Fetched ${aktivitas.length} aktivitas`)
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

export async function POST(request: NextRequest) {
  try {
    const { judul, deskripsi, dampak, kategori, pohon_ditanam, userId } = await request.json()

    console.log('📝 POST /api/aktivitas - Create aktivitas:', { judul, kategori, pohon_ditanam, userId })

    // Validasi input
    if (!judul || !deskripsi || !kategori) {
      console.warn('⚠️ Missing required fields:', { judul: !!judul, deskripsi: !!deskripsi, kategori: !!kategori })
      return NextResponse.json(
        { success: false, message: 'Judul, deskripsi, dan kategori harus diisi' },
        { status: 400 }
      )
    }

    if (!userId) {
      console.warn('⚠️ UserId tidak ditemukan')
      return NextResponse.json(
        { success: false, message: 'UserId tidak ditemukan. Silakan login ulang.' },
        { status: 400 }
      )
    }

    await connectDB()

    // Verify user exists
    let user
    try {
      user = await User.findById(userId)
    } catch (err) {
      console.warn('⚠️ Invalid user ID format:', userId, err)
      return NextResponse.json(
        { success: false, message: 'Format UserId tidak valid. Silakan login ulang.' },
        { status: 400 }
      )
    }

    if (!user) {
      console.warn('⚠️ User not found with id:', userId)
      return NextResponse.json(
        { success: false, message: 'User tidak ditemukan di database. Silakan login ulang.' },
        { status: 404 }
      )
    }

    // Create aktivitas
    const newAktivitas = new Aktivitas({
      judul: judul.trim(),
      deskripsi: deskripsi.trim(),
      dampak: dampak?.trim() || '',
      kategori: kategori.trim(),
      pohon_ditanam: kategori.trim().toLowerCase() === 'penanaman' ? (pohon_ditanam || 0) : 0,
      userId: userId
    })

    await newAktivitas.save()
    console.log('✅ Aktivitas created:', newAktivitas._id)

    return NextResponse.json(
      {
        success: true,
        message: 'Aktivitas berhasil dibuat',
        data: newAktivitas
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('❌ Error creating aktivitas:', error.message || error)
    console.error('Stack:', error.stack)
    return NextResponse.json(
      { success: false, message: 'Gagal membuat aktivitas: ' + (error.message || 'Unknown error') },
      { status: 500 }
    )
  }
}
