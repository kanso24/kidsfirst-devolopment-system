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

const me_get = defineEventHandler(async (event) => {
  const payload = getUserFromEvent(event);
  if (!payload || !payload.id) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const user = await prisma.user.findUnique({
    where: { id: payload.id },
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
    throw createError({ statusCode: 401, statusMessage: "User not found" });
  }
  return { user };
});

export { me_get as default };
//# sourceMappingURL=me.get.mjs.map
