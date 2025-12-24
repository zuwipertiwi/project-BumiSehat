import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongodb'
import User from '@/lib/models/User'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validasi input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Nama, email, dan password harus diisi' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password minimal 6 karakter' },
        { status: 400 }
      )
    }

    // Connect ke database
    await connectDB()

    // Check jika email sudah terdaftar
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email sudah terdaftar. Gunakan email lain atau login.' },
        { status: 400 }
      )
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user baru
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      profil_publik: true,
      share_aktivitas: true,
      notifikasi_email: true,
    })

    await newUser.save()

    // Return success tanpa password
    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    }

    return NextResponse.json(
      {
        message: 'Registrasi berhasil! Silakan login.',
        user: userResponse,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Register error:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat registrasi. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}
