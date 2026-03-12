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
  if (!user || user.role !== "admin") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden: Admins only" });
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
      { username: { contains: search, mode: "insensitive" } }
    ]
  } : {};
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    }),
    prisma.user.count({ where })
  ]);
  return { users, total, page, limit };
});

export { index_get as default };
//# sourceMappingURL=index.get4.mjs.map
