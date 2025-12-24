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
    const { judul, deskripsi, dampak, kategori, userId } = await request.json()

    console.log('📝 POST /api/aktivitas - Create aktivitas:', { judul, kategori })

    // Validasi input
    if (!judul || !deskripsi || !kategori || !userId) {
      console.warn('⚠️ Missing required fields')
      return NextResponse.json(
        { success: false, message: 'Judul, deskripsi, kategori, dan userId harus diisi' },
        { status: 400 }
      )
    }

    await connectDB()

    // Verify user exists
    const user = await User.findById(userId)
    if (!user) {
      console.warn('⚠️ User not found:', userId)
      return NextResponse.json(
        { success: false, message: 'User tidak ditemukan' },
        { status: 404 }
      )
    }

    // Create aktivitas
    const newAktivitas = new Aktivitas({
      judul: judul.trim(),
      deskripsi: deskripsi.trim(),
      dampak: dampak?.trim() || '',
      kategori: kategori.trim(),
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
  } catch (error) {
    console.error('❌ Error creating aktivitas:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal membuat aktivitas' },
      { status: 500 }
    )
  }
}
