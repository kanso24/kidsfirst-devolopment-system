import { defineEventHandler, createError } from 'h3'
import { getUserFromEvent } from '../../utils/auth'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const payload = getUserFromEvent(event)
  
  if (!payload || !payload.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      username: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  })

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'User not found' })
  }

  return { user }
})
