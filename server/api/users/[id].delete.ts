import { defineEventHandler, createError } from 'h3'
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

  if (currentUser.id === id) {
    throw createError({ statusCode: 400, statusMessage: 'Cannot delete your own account' })
  }

  const existingUser = await prisma.user.findUnique({ where: { id } })
  if (!existingUser) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  await prisma.user.delete({ where: { id } })

  return { message: 'User deleted successfully' }
})
