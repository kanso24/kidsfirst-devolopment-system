import { d as defineEventHandler, b as getQuery, p as prisma } from '../../nitro/nitro.mjs';
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
  const query = getQuery(event);
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const search = query.search || "";
  const where = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } }
    ];
  }
  const [questionGroups, total] = await Promise.all([
    prisma.questionGroup.findMany({
      where,
      include: {
        questions: {
          orderBy: { sortOrder: "asc" }
        }
      },
      orderBy: { sortOrder: "asc" },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.questionGroup.count({ where })
  ]);
  return {
    questionGroups,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  };
});

export { index_get as default };
//# sourceMappingURL=index.get2.mjs.map
