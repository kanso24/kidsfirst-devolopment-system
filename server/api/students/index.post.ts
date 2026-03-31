import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../utils/prisma'
import { getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { firstname, lastname, age, address, phone, gender, birthDate, parentName, image } = body

  if (!firstname || !lastname || age === undefined) {
    throw createError({ statusCode: 400, statusMessage: 'Firstname, lastname, and age are required' })
  }

  if (isNaN(parseInt(age))) {
    throw createError({ statusCode: 400, statusMessage: 'Age must be a valid number' })
  }

  const newStudent = await prisma.student.create({
    data: {
      firstname,
      lastname,
      age: parseInt(age),
      address: address || null,
      phone: phone || null,
      gender: gender || null,
      birthDate: birthDate ? new Date(birthDate) : null,
      parentName: parentName || null,
      image: image || null
    }
  })

  return { message: 'Student created successfully', student: newStudent }
})
