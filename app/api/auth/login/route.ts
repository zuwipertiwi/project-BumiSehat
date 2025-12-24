import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongodb'
import User from '@/lib/models/User'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log('🔐 Login attempt:', { email })

    // Validasi input
    if (!email || !password) {
      console.warn('⚠️ Missing fields')
      return NextResponse.json(
        { success: false, message: 'Email dan password harus diisi' },
        { status: 400 }
      )
    }

    const emailLower = email.toLowerCase().trim()

    // Connect ke database
    console.log('🔌 Connecting to MongoDB...')
    await connectDB()
    console.log('✅ Connected to MongoDB')

    // Cari user berdasarkan email
    console.log('🔍 Finding user by email:', emailLower)
    const user = await User.findOne({ email: emailLower })
    
    if (!user) {
      console.warn('⚠️ User not found:', emailLower)
      return NextResponse.json(
        { success: false, message: 'Email atau password salah' },
        { status: 401 }
      )
    }

    console.log('✅ User found:', user._id)

    // Verifikasi password menggunakan method dari model
    console.log('🔐 Verifying password...')
    const isPasswordValid = await user.comparePassword(password)
    
    if (!isPasswordValid) {
      console.warn('⚠️ Password mismatch for user:', emailLower)
      return NextResponse.json(
        { success: false, message: 'Email atau password salah' },
        { status: 401 }
      )
    }

    console.log('✅ Password verified')

    // Generate JWT token
    console.log('🎫 Generating JWT token...')
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    console.log('✅ JWT token generated')

    // Return response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
    }

    console.log('✅ Login successful for:', emailLower)
    return NextResponse.json(
      {
        success: true,
        message: 'Login berhasil!',
        token,
        user: userResponse,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('❌ Login error:', error.message || error)
    console.error('Stack:', error.stack)
    
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Terjadi kesalahan saat login. Silakan coba lagi.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
