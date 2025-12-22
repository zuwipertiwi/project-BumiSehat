// app/Controllers/Http/WelcomeController.ts
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class WelcomeController {
  public async index({ view }: HttpContextContract) {
    return view.render('welcome')
  }
}