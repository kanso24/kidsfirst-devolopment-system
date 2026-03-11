import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import prisma from '../../utils/prisma'
import { getUserFromEvent } from '../../utils/auth'

function calculateLevel(score: number): string {
  if (score <= 1.5) return 'Emerging'
  if (score <= 2.0) return 'Developing'
  if (score <= 2.5) return 'Proficient'
  return 'Advanced'
}

export default defineEventHandler(async (event) => {
  const user = getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Assessment ID is required' })
  }

  const body = await readBody(event)
  const { assessmentDate, domainScores, teacherNotes, status } = body

  const existing = await prisma.assessment.findUnique({
    where: { id: parseInt(id) },
    include: { domainScores: true }
  })

  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Assessment not found' })
  }

  const overallScore = domainScores?.reduce((acc: number, ds: any) => acc + (ds.score || 0), 0) / (domainScores?.length || 1)
  const overallLevel = calculateLevel(overallScore)

  await prisma.domainScore.deleteMany({
    where: { assessmentId: parseInt(id) }
  })

  const assessment = await prisma.assessment.update({
    where: { id: parseInt(id) },
    data: {
      assessmentDate: assessmentDate ? new Date(assessmentDate) : undefined,
      overallScore,
      overallLevel,
      teacherNotes,
      status,
      domainScores: {
        create: domainScores?.map((ds: any) => ({
          domain: ds.domain,
          score: ds.score,
          level: calculateLevel(ds.score || 0),
          observations: ds.observations,
          questionGroupId: ds.questionGroupId,
          questionScores: {
            create: ds.questionScores?.map((qs: any) => ({
              questionText: qs.questionText,
              score: qs.score
            }))
          }
        }))
      }
    },
    include: {
      student: {
        select: {
          id: true,
          firstname: true,
          lastname: true
        }
      },
      domainScores: {
        include: {
          questionScores: true
        }
      }
    }
  })

  return { message: 'Assessment updated successfully', assessment }
})
