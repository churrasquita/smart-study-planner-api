import { prisma } from "../lib/prisma";
import * as subjectService from "./subject.service";
import { HttpError } from "../middlewares/error.middleware";

interface CreateStudySessionInput {
  subjectId: string;
  assignmentId?: string;
  startedAt: Date;
  durationMinutes: number;
  notes?: string;
}

export async function createStudySession(userId: string, data: CreateStudySessionInput) {
  await subjectService.getSubject(userId, data.subjectId); // 404 si el subject no es del usuario

  if (data.assignmentId) {
    const assignment = await prisma.assignment.findFirst({
      where: { id: data.assignmentId, subjectId: data.subjectId },
    });
    if (!assignment) {
      throw new HttpError(404, "Assignment not found for this subject");
    }
  }

  return prisma.studySession.create({ data: { ...data, userId } });
}

export async function listToday(userId: string) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  return prisma.studySession.findMany({
    where: {userId, startedAt: {gte: startOfDay, lt: endOfDay}},
    orderBy: {startedAt: "asc"},
  });
}

const RANGE_DAYS: Record<"week" | "month", number> = { week: 7, month: 30 };

export async function getStatistics(userId: string, range: "week" | "month") {
  const since = new Date();
  since.setDate(since.getDate() - RANGE_DAYS[range]);

  const totals = await prisma.studySession.aggregate({
    where: { userId, startedAt: { gte: since } },
    _sum: { durationMinutes: true },
    _count: true,
  });

  const bySubject = await prisma.studySession.groupBy({
    by: ["subjectId"],
    where: { userId, startedAt: { gte: since } },
    _sum: { durationMinutes: true },
  });

  return {
    totalMinutes: totals._sum.durationMinutes ?? 0,
    totalSessions: totals._count,
    bySubject: bySubject.map((row) => ({
      subjectId: row.subjectId,
      minutes: row._sum.durationMinutes ?? 0,
    })),
  };
}
