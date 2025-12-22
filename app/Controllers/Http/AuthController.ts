import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User'

export default class AuthController {
  public async showLogin({ view, session }: HttpContextContract) {
    // Debug: Cek apakah ada flash message
    const error = session.flashMessages.get('error')
    const success = session.flashMessages.get('success')

    console.log('Flash messages:', { error, success })

    return view.render('login')
  }

  public async login({ request, response, session }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])

    try {
      // In production, use proper authentication with hashed passwords
      if (email === 'admin@gmail.com' && password === 'admin123') {
        session.put('isAdmin', true)
        console.log('Admin login successful:', email)
        return response.redirect('/admin')
      }


    const user = await User.findOne({ email })
    if (!user) {
      console.log('User not found:', email)

      // Debug: Pastikan flash message di-set
      session.flash('error', 'Email tidak ditemukan')
      console.log('Flash message set:', session.flashMessages.all())

      return response.redirect().back()
    }

    const passwordValid = await bcrypt.compare(password, user.password)
    if (!passwordValid) {
      session.flash('error', 'Password salah')
      console.log('Password invalid, flash message set:', session.flashMessages.all())
      return response.redirect().back()
    }

    const token = jwt.sign({ id: user._id }, Env.get('APP_KEY'), { expiresIn: '7d' })

    // Simpan token di cookie
    response.cookie('token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
    })

    // Arahkan ke /admin jika emailnya admin@gmail.com
    if (email === 'admin@gmail.com') {
      return response.redirect('/admin')
    }

    return response.redirect('/dashboard')
  }

  public async showRegister({ view }: HttpContextContract) {
    return view.render('register')
  }

  public async register({ request, response, session }: HttpContextContract) {
    const { name, email, password } = request.only(['name', 'email', 'password'])

    const existing = await User.findOne({ email })
    if (existing) {
      session.flash('error', 'Email sudah digunakan')
      return response.redirect().back()
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await User.create({
      name,
      email,
      password: hashedPassword,
    })

    session.flash('success', 'Pendaftaran berhasil. Silakan login.')
    return response.redirect('/login')
  }

  public async logout({ response }: HttpContextContract) {
    response.clearCookie('token')
    return response.redirect('/')
  }


}
