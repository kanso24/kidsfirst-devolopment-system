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

const _id__delete = defineEventHandler(async (event) => {
  var _a;
  const currentUser = getUserFromEvent(event);
  if (!currentUser || currentUser.role !== "admin") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden: Admins only" });
  }
  const id = parseInt(((_a = event.context.params) == null ? void 0 : _a.id) || "0");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid user ID" });
  }
  if (currentUser.id === id) {
    throw createError({ statusCode: 400, statusMessage: "Cannot delete your own account" });
  }
  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) {
    throw createError({ statusCode: 404, statusMessage: "User not found" });
  }
  await prisma.user.delete({ where: { id } });
  return { message: "User deleted successfully" };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
