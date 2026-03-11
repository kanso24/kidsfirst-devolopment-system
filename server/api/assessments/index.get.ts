import { defineEventHandler, getQuery } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 10
  const search = query.search as string || ''
  const status = query.status as string || ''
  const sortBy = query.sortBy as string || 'assessmentDate'
  const sortOrder = query.sortOrder as string || 'desc'

  const where: any = {
    student: {
      OR: [
        { firstname: { contains: search, mode: 'insensitive' } },
        { lastname: { contains: search, mode: 'insensitive' } }
      ]
    }
  }

  if (status && status !== 'all') {
    where.status = status
  }

  const [assessments, total] = await Promise.all([
    prisma.assessment.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            firstname: true,
            lastname: true
          }
        }
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.assessment.count({ where })
  ])

  return {
    assessments,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  }
})
