import { prisma } from "../lib/prisma";

const DAY_MS = 24*60*60*1000;

// últimos 7 días de minutos estudiados
// study-sessions/statistics solo da un total agregado.
export async function getWeekly(userId: string) {
  const days = 7;
  const start = new Date();
  start.setHours(0,0,0,0);
  start.setDate(start.getDate() - (days-1));

  const sessions = await prisma.studySession.findMany({
    where:{userId, startedAt: {gte: start}},
    select:{startedAt: true, durationMinutes: true},
  });

  const minutesByDay = new Map<string, number>();
  for(let i = 0; i < days;i++){
    const day = new Date(start.getTime() + i * DAY_MS);
    minutesByDay.set(day.toISOString().slice(0, 10), 0);
  }
  for (const session of sessions) {
    const key = session.startedAt.toISOString().slice(0, 10);
    minutesByDay.set(key, (minutesByDay.get(key) ?? 0) + session.durationMinutes);
  }

  return Array.from(minutesByDay.entries()).map(([date, minutes]) => ({ date, minutes }));
}

// tasa de cumplimiento del estudiante con sus assigments
export async function getProductivity(userId: string) {
  const [totalAssignments, completedAssignments, overdueCount] = await Promise.all([
    prisma.assignment.count({ where: { subject: { userId } } }),
    prisma.assignment.count({ where: { subject: { userId }, status: "COMPLETED" } }),
    prisma.assignment.count({
      where: { subject: { userId }, status: { not: "COMPLETED" }, dueDate: { lt: new Date() } },
    }),
  ]);

  return {
    totalAssignments,
    completedAssignments,
    completionRate: totalAssignments === 0 ? 0 : Math.round((completedAssignments / totalAssignments) * 100),
    overdueCount,
  };
}

// minutos totales por ramo, histórico completo 
export async function getTimePerSubject(userId: string) {
  const [rows, subjects] = await Promise.all([
    prisma.studySession.groupBy({
      by: ["subjectId"],
      where: { userId },
      _sum: { durationMinutes: true },
    }),
    prisma.subject.findMany({ where: { userId }, select: { id: true, name: true } }),
  ]);

  const nameById = new Map(subjects.map((s) => [s.id, s.name]));

  return rows
    .map((row) => ({
      subjectId: row.subjectId,
      subjectName: nameById.get(row.subjectId) ?? "Unknown",
      minutes: row._sum.durationMinutes ?? 0,
    }))
    .sort((a, b) => b.minutes - a.minutes);
}
