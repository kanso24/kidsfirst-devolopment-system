import { d as defineEventHandler, g as getUserFromEvent, c as createError, r as readBody, p as prisma } from '../../nitro/nitro.mjs';
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

const index_post = defineEventHandler(async (event) => {
  const user = getUserFromEvent(event);
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const body = await readBody(event);
  const { title, description, domain, status, sortOrder, questions } = body;
  if (!title) {
    throw createError({ statusCode: 400, statusMessage: "Title is required" });
  }
  const questionGroup = await prisma.questionGroup.create({
    data: {
      title,
      description,
      domain: domain || "sensory",
      status: status || "active",
      sortOrder: sortOrder || 0,
      questions: (questions == null ? void 0 : questions.length) ? {
        create: questions.map((q, index) => ({
          questionText: q.questionText,
          description: q.description,
          scoreType: q.scoreType || "numeric",
          minScore: q.minScore || 1,
          maxScore: q.maxScore || 3,
          step: q.step || 0.5,
          required: q.required || false,
          placeholder: q.placeholder,
          status: q.status || "active",
          sortOrder: q.sortOrder || index
        }))
      } : void 0
    },
    include: {
      questions: {
        orderBy: { sortOrder: "asc" }
      }
    }
  });
  return { message: "Question group created successfully", questionGroup };
});

export { index_post as default };
//# sourceMappingURL=index.post2.mjs.map
