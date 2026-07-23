import { prisma } from "../lib/prisma";
import { HttpError } from "../middlewares/error.middleware";
import * as subjectService from "./subject.service";

interface GoalInput {
  title?: string;
  description?: string;
  subjectId?: string;
  targetDate?: Date;
  progress?: number;
  status?: "ACTIVE" | "COMPLETED" | "ABANDONED";
}

export function listGoals(userId: string) {
  return prisma.goal.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export async function getGoal(userId: string, id: string) {
  const goal = await prisma.goal.findFirst({ where: { id, userId } });
  if (!goal) {
    throw new HttpError(404, "Goal not found");
  }
  return goal;
}

export async function createGoal(userId: string, data: GoalInput) {
  if (data.subjectId) {
    await subjectService.getSubject(userId, data.subjectId); // 404 si el subject no es del usuario
  }

  return prisma.goal.create({
    data: {
      title: data.title!,
      description: data.description,
      subjectId: data.subjectId,
      targetDate: data.targetDate,
      userId,
    },
  });
}

export async function updateGoal(userId: string, id: string, data: GoalInput) {
  await getGoal(userId, id);

  if (data.subjectId) {
    await subjectService.getSubject(userId, data.subjectId);
  }

  return prisma.goal.update({ where: { id }, data });
}

export async function deleteGoal(userId: string, id: string) {
  await getGoal(userId, id);
  await prisma.goal.delete({ where: { id } });
}
