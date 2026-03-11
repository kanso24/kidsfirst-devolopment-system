import jwt from 'jsonwebtoken'
import { H3Event } from 'h3'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-production'

export const generateToken = (payload: any) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })
}

export interface TokenPayload {
  id: number;
  username: string;
  role: string;
}

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch (e) {
    return null
  }
}

export const getUserFromEvent = (event: H3Event) => {
  const token = getCookie(event, 'auth_token')
  if (!token) return null
  return verifyToken(token)
}
