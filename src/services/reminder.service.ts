import { prisma } from "../lib/prisma";
import { HttpError } from "../middlewares/error.middleware";

interface ReminderInput {
  assignmentId?: string;
  goalId?: string;
  remindAt: Date;
  message: string;
}

export function listReminders(userId: string){
  return prisma.reminder.findMany({ where: {userId}, orderBy: {remindAt: "asc"}});
}

export async function createReminder(userId: string, data: ReminderInput){
  const hasAssignment = Boolean(data.assignmentId);
  const hasGoal = Boolean(data.goalId);
  if(hasAssignment === hasGoal){
    throw new HttpError(400, "A reminder must reference exactly one of assignmentId or goalId");
  }

  if (data.assignmentId) {
    const assignment = await prisma.assignment.findFirst({
      where: { id: data.assignmentId, subject: {userId}},
    });
    if (!assignment) {
      throw new HttpError(404, "Assignment not found");
    }
  }

  if (data.goalId) {
    const goal = await prisma.goal.findFirst({ where: { id: data.goalId, userId } });
    if (!goal) {
      throw new HttpError(404, "Goal not found");
    }
  }

  return prisma.reminder.create({ data: { ...data, userId } });
}

export async function getReminder(userId: string, id: string) {
  const reminder = await prisma.reminder.findFirst({ where: { id, userId } });
  if (!reminder) {
    throw new HttpError(404, "Reminder not found");
  }
  return reminder;
}

export async function deleteReminder(userId: string, id: string) {
  await getReminder(userId, id);
  await prisma.reminder.delete({ where: { id } });
}
