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
  if (!currentUser || currentUser.role !== "admin") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden: Admins only" });
  }
  const id = parseInt(((_a = event.context.params) == null ? void 0 : _a.id) || "0");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid user ID" });
  }
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      username: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  });
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: "User not found" });
  }
  return { user };
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
