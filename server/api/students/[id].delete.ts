import { defineEventHandler, createError } from 'h3'
import prisma from '../../utils/prisma'
import { getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const currentUser = getUserFromEvent(event)
  if (!currentUser) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const id = parseInt(event.context.params?.id || '0')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid student ID' })
  }

  const existingStudent = await prisma.student.findUnique({ where: { id } })
  if (!existingStudent) {
    throw createError({ statusCode: 404, statusMessage: 'Student not found' })
  }

  await prisma.student.delete({ where: { id } })

  return { message: 'Student deleted successfully' }
})
