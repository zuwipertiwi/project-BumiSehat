import type { UserType } from 'App/Models/User'

declare module '@ioc:Adonis/Core/HttpContext' {
  interface HttpContextContract {
    currentUser: UserType
  }
}
