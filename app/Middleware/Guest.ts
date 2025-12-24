import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GuestMiddleware {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    try {
      if (await auth.use('web').check()) {
        return response.redirect('/dashboard')
      }
    } catch (error) {
      // User is not authenticated, proceed
    }
    
    await next()
  }
}