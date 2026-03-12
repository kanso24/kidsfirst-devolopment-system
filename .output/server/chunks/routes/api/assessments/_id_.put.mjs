import { d as defineEventHandler, g as getUserFromEvent, c as createError, a as getRouterParam, r as readBody, p as prisma } from '../../../nitro/nitro.mjs';
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

function calculateLevel(score) {
  if (score <= 1.5) return "Emerging";
  if (score <= 2) return "Developing";
  if (score <= 2.5) return "Proficient";
  return "Advanced";
}
const _id__put = defineEventHandler(async (event) => {
  const user = getUserFromEvent(event);
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Assessment ID is required" });
  }
  const body = await readBody(event);
  const { assessmentDate, domainScores, teacherNotes, status } = body;
  const existing = await prisma.assessment.findUnique({
    where: { id: parseInt(id) },
    include: { domainScores: true }
  });
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: "Assessment not found" });
  }
  const allScores = (domainScores == null ? void 0 : domainScores.flatMap((ds) => {
    var _a;
    return ((_a = ds.questionScores) == null ? void 0 : _a.map((qs) => qs.score)) || [];
  })) || [];
  const overallScore = allScores.length > 0 ? parseFloat((allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(2)) : 0;
  const overallLevel = calculateLevel(overallScore);
  await prisma.domainScore.deleteMany({
    where: { assessmentId: parseInt(id) }
  });
  const assessment = await prisma.assessment.update({
    where: { id: parseInt(id) },
    data: {
      assessmentDate: assessmentDate ? new Date(assessmentDate) : void 0,
      overallScore,
      overallLevel,
      teacherNotes,
      status,
      domainScores: {
        create: domainScores == null ? void 0 : domainScores.map((ds) => {
          var _a;
          return {
            domain: ds.domain,
            score: ds.score,
            level: calculateLevel(ds.score || 0),
            observations: ds.observations,
            questionGroupId: ds.questionGroupId,
            questionScores: {
              create: (_a = ds.questionScores) == null ? void 0 : _a.map((qs) => ({
                questionText: qs.questionText,
                score: qs.score
              }))
            }
          };
        })
      }
    },
    include: {
      student: {
        select: {
          id: true,
          firstname: true,
          lastname: true
        }
      },
      domainScores: {
        include: {
          questionScores: true
        }
      }
    }
  });
  return { message: "Assessment updated successfully", assessment };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
