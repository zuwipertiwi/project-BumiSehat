import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GuestMiddleware {
  public async handle({ }: HttpContextContract, next: () => Promise<void>) {
    // Jika user sudah login, redirect ke dashboard
    // Untuk skrg, skip check dan lanjut ke next
    await next()
  }
}