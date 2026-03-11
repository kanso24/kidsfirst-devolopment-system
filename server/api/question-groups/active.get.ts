import { defineEventHandler, getQuery } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const domain = query.domain as string

  const where: any = {
    status: 'active'
  }

  if (domain) {
    where.domain = domain
  }

  const questionGroups = await prisma.questionGroup.findMany({
    where,
    include: {
      questions: {
        where: { status: 'active' },
        orderBy: { sortOrder: 'asc' }
      }
    },
    orderBy: { sortOrder: 'asc' }
  })

  return { questionGroups }
})
