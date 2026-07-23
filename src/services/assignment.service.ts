import { prisma } from "../lib/prisma";
import { HttpError } from "../middlewares/error.middleware";
import * as subjectService from "./subject.service";

interface AssignmentInput {
  title?: string;
  description?: string;
  dueDate?: Date;
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

export async function listBySubject(userId: string, subjectId: string) {
  await subjectService.getSubject(userId, subjectId); // valida ownership, 404 si no existe/no es tuyo
  return prisma.assignment.findMany({ where: { subjectId }, orderBy: { dueDate: "asc" } });
}

export async function getAssignment(userId: string, id: string){
  const assignment = await prisma.assignment.findFirst({ where: { id, subject: { userId } } });
  if (!assignment) {
    throw new HttpError(404, "Assignment not found");
  }
  return assignment;
}

export async function createAssignment(userId: string, subjectId: string, data: AssignmentInput){
  await subjectService.getSubject(userId, subjectId);
  return prisma.assignment.create({
    data: {
      title: data.title!,
      description: data.description,
      dueDate: data.dueDate!,
      status: data.status,
      subjectId,
    },
  });
}

export async function updateAssignment(userId: string, id: string, data: AssignmentInput){
  await getAssignment(userId, id);
  return prisma.assignment.update({ where: { id }, data });
}

export async function deleteAssignment(userId: string, id: string){
  await getAssignment(userId, id);
  await prisma.assignment.delete({ where: { id } });
}

export async function listUpcoming(userId: string, days: number){
  const now = new Date();
  const limit = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return prisma.assignment.findMany({
    where: {
      subject: { userId },
      dueDate: { gte: now, lte: limit },
      status: { not: "COMPLETED" },
    },
    orderBy:{dueDate: "asc"},
  });
}

export async function listOverdue(userId: string) {
  const now = new Date();

  return prisma.assignment.findMany({
    where: {
      subject: { userId },
      dueDate: { lt: now },
      status: { not: "COMPLETED" },
    },
    orderBy: { dueDate: "asc" },
  });
}
