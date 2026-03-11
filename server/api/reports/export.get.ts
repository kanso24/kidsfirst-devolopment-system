import { defineEventHandler, getQuery, createError } from 'h3'
import prisma from '../../utils/prisma'
import { getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const query = getQuery(event)
  const type = query.type as string || 'users' // 'users' or 'students'

  if (type === 'users') {
    if (user.role !== 'admin') {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }
    const data = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        username: true,
        role: true,
        createdAt: true
      }
    })
    return { data, type: 'users' }
  } else if (type === 'students') {
    const data = await prisma.student.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return { data, type: 'students' }
  }

  throw createError({ statusCode: 400, statusMessage: 'Invalid report type' })
})
