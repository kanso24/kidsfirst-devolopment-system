import { defineEventHandler, readBody, createError } from 'h3'
import bcrypt from 'bcryptjs'
import prisma from '../../utils/prisma'
import { getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const currentUser = getUserFromEvent(event)
  if (!currentUser || currentUser.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden: Admins only' })
  }

  const id = parseInt(event.context.params?.id || '0')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid user ID' })
  }

  const body = await readBody(event)
  const { firstname, lastname, username, password, role } = body

  const existingUser = await prisma.user.findUnique({ where: { id } })
  if (!existingUser) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  if (username && username !== existingUser.username) {
    const usernameTaken = await prisma.user.findUnique({ where: { username } })
    if (usernameTaken) {
      throw createError({ statusCode: 400, statusMessage: 'Username already exists' })
    }
  }

  const updateData: any = {
    firstname: firstname || existingUser.firstname,
    lastname: lastname || existingUser.lastname,
    username: username || existingUser.username,
    role: role || existingUser.role,
  }

  if (password) {
    if (password.length < 6) {
      throw createError({ statusCode: 400, statusMessage: 'Password must be at least 6 characters' })
    }
    updateData.password = await bcrypt.hash(password, 10)
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      firstname: true,
      lastname: true,
      username: true,
      role: true,
      updatedAt: true
    }
  })

  return { message: 'User updated successfully', user: updatedUser }
})
