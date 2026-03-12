import { d as defineEventHandler, g as getUserFromEvent, c as createError, b as getQuery, p as prisma } from '../../../nitro/nitro.mjs';
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

const export_get = defineEventHandler(async (event) => {
  const user = getUserFromEvent(event);
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const query = getQuery(event);
  const type = query.type || "users";
  if (type === "users") {
    if (user.role !== "admin") {
      throw createError({ statusCode: 403, statusMessage: "Forbidden" });
    }
    const data = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        username: true,
        role: true,
        createdAt: true
      }
    });
    return { data, type: "users" };
  } else if (type === "students") {
    const data = await prisma.student.findMany({
      orderBy: { createdAt: "desc" }
    });
    return { data, type: "students" };
  }
  throw createError({ statusCode: 400, statusMessage: "Invalid report type" });
});

export { export_get as default };
//# sourceMappingURL=export.get.mjs.map
