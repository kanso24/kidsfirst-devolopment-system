import { defineEventHandler, createError } from 'h3'
import prisma from '../../utils/prisma'
import { getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const [totalUsers, totalStudents, totalQuestionGroups, totalAssessments, recentUsers, recentStudents] = await Promise.all([
    prisma.user.count(),
    prisma.student.count(),
    prisma.questionGroup.count(),
    prisma.assessment.count(),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        username: true,
        role: true,
        createdAt: true
      }
    }),
    prisma.student.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    })
  ])

  return {
    summary: {
      totalUsers,
      totalStudents,
      totalQuestionGroups,
      totalAssessments
    },
    recent: {
      users: recentUsers,
      students: recentStudents
    }
  }
})
