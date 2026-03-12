import { d as defineEventHandler, g as getUserFromEvent, c as createError, a as getRouterParam, p as prisma } from '../../../nitro/nitro.mjs';
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

const _id__delete = defineEventHandler(async (event) => {
  const user = getUserFromEvent(event);
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Assessment ID is required" });
  }
  const existing = await prisma.assessment.findUnique({
    where: { id: parseInt(id) }
  });
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: "Assessment not found" });
  }
  await prisma.assessment.delete({
    where: { id: parseInt(id) }
  });
  return { message: "Assessment deleted successfully" };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
