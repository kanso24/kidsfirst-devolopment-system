import { d as defineEventHandler, g as getUserFromEvent, c as createError, r as readBody, p as prisma } from '../../nitro/nitro.mjs';
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

const index_post = defineEventHandler(async (event) => {
  const user = getUserFromEvent(event);
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const body = await readBody(event);
  const { firstname, lastname, age, address, phone } = body;
  if (!firstname || !lastname || age === void 0) {
    throw createError({ statusCode: 400, statusMessage: "Firstname, lastname, and age are required" });
  }
  if (isNaN(parseInt(age))) {
    throw createError({ statusCode: 400, statusMessage: "Age must be a valid number" });
  }
  const newStudent = await prisma.student.create({
    data: {
      firstname,
      lastname,
      age: parseInt(age),
      address: address || null,
      phone: phone || null
    }
  });
  return { message: "Student created successfully", student: newStudent };
});

export { index_post as default };
//# sourceMappingURL=index.post3.mjs.map
