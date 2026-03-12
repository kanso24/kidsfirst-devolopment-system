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

function calculateLevel(score) {
  if (score <= 1.5) return "Emerging";
  if (score <= 2) return "Developing";
  if (score <= 2.5) return "Proficient";
  return "Advanced";
}
function generateAssessmentNumber() {
  const date = /* @__PURE__ */ new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 1e4).toString().padStart(4, "0");
  return `AS-${year}${month}-${random}`;
}
const index_post = defineEventHandler(async (event) => {
  const user = getUserFromEvent(event);
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const body = await readBody(event);
  const { studentId, assessmentDate, domainScores, teacherNotes } = body;
  if (!studentId) {
    throw createError({ statusCode: 400, statusMessage: "Student is required" });
  }
  const student = await prisma.student.findUnique({
    where: { id: studentId }
  });
  if (!student) {
    throw createError({ statusCode: 400, statusMessage: "Student not found" });
  }
  const assessmentNumber = generateAssessmentNumber();
  const allScores = (domainScores == null ? void 0 : domainScores.flatMap((ds) => {
    var _a;
    return ((_a = ds.questionScores) == null ? void 0 : _a.map((qs) => qs.score)) || [];
  })) || [];
  const overallScore = allScores.length > 0 ? parseFloat((allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(2)) : 0;
  const overallLevel = calculateLevel(overallScore);
  const assessment = await prisma.assessment.create({
    data: {
      assessmentNumber,
      studentId,
      assessmentDate: assessmentDate ? new Date(assessmentDate) : /* @__PURE__ */ new Date(),
      overallScore,
      overallLevel,
      status: "completed",
      teacherNotes,
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
  return { message: "Assessment created successfully", assessment };
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
