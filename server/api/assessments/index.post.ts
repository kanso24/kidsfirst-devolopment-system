import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../utils/prisma'
import { getUserFromEvent } from '../../utils/auth'

function calculateLevel(score: number): string {
  if (score <= 1.5) return 'Emerging'
  if (score <= 2.0) return 'Developing'
  if (score <= 2.5) return 'Proficient'
  return 'Advanced'
}

function generateAssessmentNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `AS-${year}${month}-${random}`
}

export default defineEventHandler(async (event) => {
  const user = getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { studentId, assessmentDate, domainScores, teacherNotes } = body

  if (!studentId) {
    throw createError({ statusCode: 400, statusMessage: 'Student is required' })
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId }
  })

  if (!student) {
    throw createError({ statusCode: 400, statusMessage: 'Student not found' })
  }

  const assessmentNumber = generateAssessmentNumber()

  const allScores = domainScores?.flatMap((ds: any) => ds.questionScores?.map((qs: any) => qs.score) || []) || []
  const overallScore = allScores.length > 0 ? parseFloat((allScores.reduce((a: number, b: number) => a + b, 0) / allScores.length).toFixed(2)) : 0
  const overallLevel = calculateLevel(overallScore)

  const assessment = await prisma.assessment.create({
    data: {
      assessmentNumber,
      studentId,
      assessmentDate: assessmentDate ? new Date(assessmentDate) : new Date(),
      overallScore,
      overallLevel,
      status: 'completed',
      teacherNotes,
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

  return { message: 'Assessment created successfully', assessment }
})
