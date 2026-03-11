import { defineEventHandler, getQuery } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 10
  const search = query.search as string || ''

  const where: any = {}

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ]
  }

  const [questionGroups, total] = await Promise.all([
    prisma.questionGroup.findMany({
      where,
      include: {
        questions: {
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: { sortOrder: 'asc' },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.questionGroup.count({ where })
  ])

  return {
    questionGroups,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  }
})
