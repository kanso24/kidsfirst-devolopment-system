import { d as defineEventHandler, g as getUserFromEvent, c as createError, b as getQuery, p as prisma } from '../../nitro/nitro.mjs';
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

const index_get = defineEventHandler(async (event) => {
  const user = getUserFromEvent(event);
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const query = getQuery(event);
  const search = query.search || "";
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
  const where = search ? {
    OR: [
      { firstname: { contains: search, mode: "insensitive" } },
      { lastname: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } }
    ]
  } : {};
  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" }
    }),
    prisma.student.count({ where })
  ]);
  return { students, total, page, limit };
});

export { index_get as default };
//# sourceMappingURL=index.get3.mjs.map
