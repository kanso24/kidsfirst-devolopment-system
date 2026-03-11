import { defineEventHandler, getRouterParam, createError } from 'h3'
import prisma from '../../utils/prisma'
import { getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Assessment ID is required' })
  }

  const existing = await prisma.assessment.findUnique({
    where: { id: parseInt(id) }
  })

  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Assessment not found' })
  }

  await prisma.assessment.delete({
    where: { id: parseInt(id) }
  })

  return { message: 'Assessment deleted successfully' }
})
