import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../utils/prisma'
import { getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { title, description, domain, status, sortOrder, questions } = body

  if (!title) {
    throw createError({ statusCode: 400, statusMessage: 'Title is required' })
  }

  const questionGroup = await prisma.questionGroup.create({
    data: {
      title,
      description,
      domain: domain || 'sensory',
      status: status || 'active',
      sortOrder: sortOrder || 0,
      questions: questions?.length ? {
        create: questions.map((q: any, index: number) => ({
          questionText: q.questionText,
          description: q.description,
          scoreType: q.scoreType || 'numeric',
          minScore: q.minScore || 1.0,
          maxScore: q.maxScore || 3.0,
          step: q.step || 0.5,
          required: q.required || false,
          placeholder: q.placeholder,
          status: q.status || 'active',
          sortOrder: q.sortOrder || index
        }))
      } : undefined
    },
    include: {
      questions: {
        orderBy: { sortOrder: 'asc' }
      }
    }
  })

  return { message: 'Question group created successfully', questionGroup }
})
