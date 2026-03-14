import { defineEventHandler, readBody, setCookie, createError } from 'h3'
import bcrypt from 'bcryptjs'
import prisma from '../../utils/prisma'
import { generateToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { username, password } = body

    if (!username || !password) {
      throw createError({ statusCode: 400, statusMessage: 'Username and password are required' })
    }

    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role
    }

    const token = generateToken(payload)

    // Set HTTP-only cookie
    setCookie(event, 'auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/'
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return {
      message: 'Login successful',
      user: userWithoutPassword
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'Internal server error', message: `DB Error: ${error.message}` })
  }
})
