import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongodb'
import Tips from '@/lib/models/Tips'

export async function GET(request: NextRequest) {
  try {
    console.log('📥 GET /api/tips - Fetch all tips')
    
    await connectDB()
    const tips = await Tips.find().sort({ createdAt: -1 })
    
    console.log(`✅ Fetched ${tips.length} tips`)
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

export async function POST(request: NextRequest) {
  try {
    const { judul, kategori, deskripsi, konten } = await request.json()

    console.log('📝 POST /api/tips - Create tips:', { judul, kategori })

    // Validasi input
    if (!judul || !kategori || !deskripsi || !konten) {
      console.warn('⚠️ Missing required fields')
      return NextResponse.json(
        { success: false, message: 'Judul, kategori, deskripsi, dan konten harus diisi' },
        { status: 400 }
      )
    }

    await connectDB()

    // Create tips
    const newTips = new Tips({
      judul: judul.trim(),
      kategori: kategori.trim(),
      deskripsi: deskripsi.trim(),
      konten: konten.trim(),
      views: 0
    })

    await newTips.save()
    console.log('✅ Tips created:', newTips._id)

    return NextResponse.json(
      {
        success: true,
        message: 'Tips berhasil dibuat',
        data: newTips
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('❌ Error creating tips:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal membuat tips' },
      { status: 500 }
    )
  }
}
