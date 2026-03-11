import { defineEventHandler, getRouterParam, createError } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Assessment ID is required' })
  }

  const assessment = await prisma.assessment.findUnique({
    where: { id: parseInt(id) },
    include: {
      student: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          age: true
        }
      },
      domainScores: {
        include: {
          questionScores: true
        }
      }
    }
  })

  if (!assessment) {
    throw createError({ statusCode: 404, statusMessage: 'Assessment not found' })
  }

  return { assessment }
})
