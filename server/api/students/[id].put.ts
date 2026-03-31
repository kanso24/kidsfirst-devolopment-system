import { defineEventHandler, readBody, createError } from 'h3'
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

  const body = await readBody(event)
  const { firstname, lastname, age, address, phone, gender, birthDate, parentName, image } = body

  const existingStudent = await prisma.student.findUnique({ where: { id } })
  if (!existingStudent) {
    throw createError({ statusCode: 404, statusMessage: 'Student not found' })
  }

  const updateData: any = {
    firstname: firstname || existingStudent.firstname,
    lastname: lastname || existingStudent.lastname,
    address: address !== undefined ? address : existingStudent.address,
    phone: phone !== undefined ? phone : existingStudent.phone,
    gender: gender !== undefined ? gender : existingStudent.gender,
    birthDate: birthDate !== undefined ? (birthDate ? new Date(birthDate) : null) : existingStudent.birthDate,
    parentName: parentName !== undefined ? parentName : existingStudent.parentName,
    image: image !== undefined ? image : existingStudent.image
  }

  if (age !== undefined) {
    if (isNaN(parseInt(age))) {
      throw createError({ statusCode: 400, statusMessage: 'Age must be a valid number' })
    }
    updateData.age = parseInt(age)
  }

  const updatedStudent = await prisma.student.update({
    where: { id },
    data: updateData
  })

  return { message: 'Student updated successfully', student: updatedStudent }
})
