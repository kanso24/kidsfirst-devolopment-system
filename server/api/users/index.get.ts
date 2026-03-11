import { defineEventHandler, getQuery } from 'h3'
import prisma from '../../utils/prisma'
import { getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = getUserFromEvent(event)
  if (!user || user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden: Admins only' })
  }

  const query = getQuery(event)
  const search = query.search as string || ''
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 10
  const skip = (page - 1) * limit

  const where = search ? {
    OR: [
      { firstname: { contains: search, mode: 'insensitive' as const } },
      { lastname: { contains: search, mode: 'insensitive' as const } },
      { username: { contains: search, mode: 'insensitive' as const } },
    ]
  } : {}

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    }),
    prisma.user.count({ where })
  ])

  return { users, total, page, limit }
})
