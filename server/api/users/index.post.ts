import { defineEventHandler, readBody, createError } from 'h3'
import bcrypt from 'bcryptjs'
import prisma from '../../utils/prisma'
import { getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const currentUser = getUserFromEvent(event)
  if (!currentUser || currentUser.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden: Admins only' })
  }

  const body = await readBody(event)
  const { firstname, lastname, username, password, role } = body

  if (!firstname || !lastname || !username || !password) {
    throw createError({ statusCode: 400, statusMessage: 'All fields are required' })
  }
  
  if (password.length < 6) {
    throw createError({ statusCode: 400, statusMessage: 'Password must be at least 6 characters' })
  }

  const existingUser = await prisma.user.findUnique({
    where: { username }
  })

  if (existingUser) {
    throw createError({ statusCode: 400, statusMessage: 'Username already exists' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = await prisma.user.create({
    data: {
      firstname,
      lastname,
      username,
      password: hashedPassword,
      role: role || 'staff'
    },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      username: true,
      role: true,
      createdAt: true
    }
  })

  return { message: 'User created successfully', user: newUser }
})
