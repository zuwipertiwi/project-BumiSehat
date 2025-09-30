import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    const { name, email, password, confirmPassword } = request.all()

    if (password !== confirmPassword) {
      return response.redirect('/register') // bisa ditambahkan flash message
    }

    // Simulasi sukses (tanpa database)
    return response.redirect('/dashboard')
  }

  public async login({ request, response }: HttpContextContract) {
    const { email, password } = request.all()

    // Simulasi login (bisa tambahkan validasi manual)
    if (email === 'admin@bumisehat.com' && password === 'admin123') {
      return response.redirect('/dashboard')
    }

    return response.redirect('/')
  }
}