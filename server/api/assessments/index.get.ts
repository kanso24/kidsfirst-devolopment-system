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

  const studentId = parseInt(query.studentId as string) || 0
  const startDate = query.startDate as string || ''
  const endDate = query.endDate as string || ''
  const questionGroupId = parseInt(query.questionGroupId as string) || 0
  
  const where: any = {}

  if (studentId) {
    where.studentId = studentId
  } else if (search) {
    where.student = {
      OR: [
        { firstname: { contains: search, mode: 'insensitive' } },
        { lastname: { contains: search, mode: 'insensitive' } }
      ]
    }
  }

  if (status && status !== 'all') {
    where.status = status
  }

  if (startDate) {
    where.assessmentDate = {
      ...where.assessmentDate,
      gte: new Date(startDate)
    }
  }

  if (endDate) {
    where.assessmentDate = {
      ...where.assessmentDate,
      lte: new Date(endDate + 'T23:59:59.999Z')
    }
  }

  if (questionGroupId) {
    where.domainScores = {
      some: {
        questionGroupId: questionGroupId
      }
    }
  }

  const [assessments, total] = await Promise.all([
    prisma.assessment.findMany({
      where,
      include: {
        student: true,
        domainScores: {
          include: {
            questionGroup: true
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
