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
  const status = query.status || "";
  const sortBy = query.sortBy || "assessmentDate";
  const sortOrder = query.sortOrder || "desc";
  const where = {
    student: {
      OR: [
        { firstname: { contains: search, mode: "insensitive" } },
        { lastname: { contains: search, mode: "insensitive" } }
      ]
    }
  };
  if (status && status !== "all") {
    where.status = status;
  }
  const [assessments, total] = await Promise.all([
    prisma.assessment.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            firstname: true,
            lastname: true
          }
        }
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.assessment.count({ where })
  ]);
  return {
    assessments,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  };
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
