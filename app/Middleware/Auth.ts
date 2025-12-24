import type { GuardsList } from '@ioc:Adonis/Addons/Auth'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { AuthenticationException } from '@adonisjs/auth/build/standalone'

import jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User'

export default class AuthMiddleware {
  protected redirectTo = '/login'


  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    try {
      const token = ctx.request.cookie('token')

      if (!token) {
        return ctx.response.redirect('/login')
      }

      const decoded = jwt.verify(token, Env.get('APP_KEY')) as { id: string }

      const user = await User.findById(decoded.id)

      if (!user) {
        ctx.response.clearCookie('token')
        return ctx.response.redirect('/login')
      }

      // Set currentUser manual
      ctx.currentUser = user

      await next()
    } catch (error) {
      console.error('Auth middleware error:', error)
      ctx.response.clearCookie('token')
      return ctx.response.redirect('/login')
    }
  }

}
