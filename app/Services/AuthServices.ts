import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10)
}

export const verifyPassword = async (plain: string, hashed: string) => {
  return await bcrypt.compare(plain, hashed)
}

export const generateToken = (payload: object) => {
  return jwt.sign(payload, Env.get('JWT_SECRET'), { expiresIn: '1d' })
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, Env.get('JWT_SECRET'))
}
