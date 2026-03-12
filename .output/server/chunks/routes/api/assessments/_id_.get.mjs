import { d as defineEventHandler, a as getRouterParam, c as createError, p as prisma } from '../../../nitro/nitro.mjs';
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
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Assessment ID is required" });
  }
  const assessment = await prisma.assessment.findUnique({
    where: { id: parseInt(id) },
    include: {
      student: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          age: true
        }
      },
      domainScores: {
        include: {
          questionScores: true
        }
      }
    }
  });
  if (!assessment) {
    throw createError({ statusCode: 404, statusMessage: "Assessment not found" });
  }
  return { assessment };
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
