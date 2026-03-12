import { d as defineEventHandler, g as getUserFromEvent, c as createError, p as prisma } from '../../../nitro/nitro.mjs';
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

const _id__get = defineEventHandler(async (event) => {
  var _a;
  const currentUser = getUserFromEvent(event);
  if (!currentUser) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const id = parseInt(((_a = event.context.params) == null ? void 0 : _a.id) || "0");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid student ID" });
  }
  const student = await prisma.student.findUnique({
    where: { id }
  });
  if (!student) {
    throw createError({ statusCode: 404, statusMessage: "Student not found" });
  }
  return { student };
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
