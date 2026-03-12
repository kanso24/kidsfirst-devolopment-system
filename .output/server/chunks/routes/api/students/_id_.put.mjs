import { d as defineEventHandler, g as getUserFromEvent, c as createError, r as readBody, p as prisma } from '../../../nitro/nitro.mjs';
import 'jsonwebtoken';
import '@prisma/client';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@iconify/utils';
import 'consola';

const _id__put = defineEventHandler(async (event) => {
  var _a;
  const currentUser = getUserFromEvent(event);
  if (!currentUser) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const id = parseInt(((_a = event.context.params) == null ? void 0 : _a.id) || "0");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid student ID" });
  }
  const body = await readBody(event);
  const { firstname, lastname, age, address, phone } = body;
  const existingStudent = await prisma.student.findUnique({ where: { id } });
  if (!existingStudent) {
    throw createError({ statusCode: 404, statusMessage: "Student not found" });
  }
  const updateData = {
    firstname: firstname || existingStudent.firstname,
    lastname: lastname || existingStudent.lastname,
    address: address !== void 0 ? address : existingStudent.address,
    phone: phone !== void 0 ? phone : existingStudent.phone
  };
  if (age !== void 0) {
    if (isNaN(parseInt(age))) {
      throw createError({ statusCode: 400, statusMessage: "Age must be a valid number" });
    }
    updateData.age = parseInt(age);
  }
  const updatedStudent = await prisma.student.update({
    where: { id },
    data: updateData
  });
  return { message: "Student updated successfully", student: updatedStudent };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
