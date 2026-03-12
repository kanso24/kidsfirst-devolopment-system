import { d as defineEventHandler, g as getUserFromEvent, c as createError, p as prisma } from '../../../nitro/nitro.mjs';
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

const summary_get = defineEventHandler(async (event) => {
  const user = getUserFromEvent(event);
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const [totalUsers, totalStudents, totalQuestionGroups, totalAssessments, recentUsers, recentStudents] = await Promise.all([
    prisma.user.count(),
    prisma.student.count(),
    prisma.questionGroup.count(),
    prisma.assessment.count(),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        username: true,
        role: true,
        createdAt: true
      }
    }),
    prisma.student.findMany({
      take: 5,
      orderBy: { createdAt: "desc" }
    })
  ]);
  return {
    summary: {
      totalUsers,
      totalStudents,
      totalQuestionGroups,
      totalAssessments
    },
    recent: {
      users: recentUsers,
      students: recentStudents
    }
  };
});

export { summary_get as default };
//# sourceMappingURL=summary.get.mjs.map
