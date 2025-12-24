import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongodb'
import User from '@/lib/models/User'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    console.log('📝 Register attempt:', { name, email })

    // Validasi input
    if (!name || !email || !password) {
      console.warn('⚠️ Missing fields')
      return NextResponse.json(
        { success: false, message: 'Nama, email, dan password harus diisi' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      console.warn('⚠️ Password too short')
      return NextResponse.json(
        { success: false, message: 'Password minimal 6 karakter' },
        { status: 400 }
      )
    }

    const emailLower = email.toLowerCase().trim()

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailLower)) {
      console.warn('⚠️ Invalid email format')
      return NextResponse.json(
        { success: false, message: 'Format email tidak valid' },
        { status: 400 }
      )
    }

    // Connect ke database
    console.log('🔌 Connecting to MongoDB...')
    await connectDB()
    console.log('✅ Connected to MongoDB')

    // Check jika email sudah terdaftar
    console.log('🔍 Checking if email exists...')
    const existingUser = await User.findOne({ email: emailLower })
    
    if (existingUser) {
      console.warn('⚠️ Email already registered:', emailLower)
      return NextResponse.json(
        { success: false, message: 'Email sudah terdaftar. Gunakan email lain atau login.' },
        { status: 400 }
      )
    }

    console.log('✅ Email not registered, proceeding...')

    // Create user baru dengan password plain (akan di-hash oleh pre-save hook)
    console.log('💾 Creating new user...')
    const newUser = new User({
      name: name.trim(),
      email: emailLower,
      password: password, // Plain password, akan di-hash oleh pre-save hook
      profil_publik: true,
      share_aktivitas: true,
      notifikasi_email: true,
    })

    await newUser.save()
    console.log('✅ User saved successfully:', newUser._id)

    // Return success tanpa password
    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    }

    console.log('✅ Registration successful for:', emailLower)
    return NextResponse.json(
      {
        success: true,
        message: 'Registrasi berhasil! Silakan login.',
        user: userResponse,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('❌ Register error:', error.message || error)
    console.error('Stack:', error.stack)
    
    // Return error dengan detail yang helpful
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Terjadi kesalahan saat registrasi. Silakan coba lagi.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
