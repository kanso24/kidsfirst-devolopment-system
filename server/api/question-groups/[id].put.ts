import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import prisma from '../../utils/prisma'
import { getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Question group ID is required' })
  }

  const body = await readBody(event)
  const { title, description, domain, status, sortOrder, questions } = body

  const existing = await prisma.questionGroup.findUnique({
    where: { id: parseInt(id) },
    include: { questions: true }
  })

  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Question group not found' })
  }

  if (questions) {
    await prisma.question.deleteMany({
      where: { questionGroupId: parseInt(id) }
    })
  }

  const questionGroup = await prisma.questionGroup.update({
    where: { id: parseInt(id) },
    data: {
      title,
      description,
      domain: domain || existing.domain,
      status,
      sortOrder,
      ...(questions && {
        questions: {
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
        }
      })
    },
    include: {
      questions: {
        orderBy: { sortOrder: 'asc' }
      }
    }
  })

  return { message: 'Question group updated successfully', questionGroup }
})
