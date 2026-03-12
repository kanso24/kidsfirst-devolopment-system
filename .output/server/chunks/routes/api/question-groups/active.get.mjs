import { d as defineEventHandler, b as getQuery, p as prisma } from '../../../nitro/nitro.mjs';
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

const active_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const domain = query.domain;
  const where = {
    status: "active"
  };
  if (domain) {
    where.domain = domain;
  }
  const questionGroups = await prisma.questionGroup.findMany({
    where,
    include: {
      questions: {
        where: { status: "active" },
        orderBy: { sortOrder: "asc" }
      }
    },
    orderBy: { sortOrder: "asc" }
  });
  return { questionGroups };
});

export { active_get as default };
//# sourceMappingURL=active.get.mjs.map
