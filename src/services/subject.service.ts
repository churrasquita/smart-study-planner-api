import { prisma } from "../lib/prisma";
import { HttpError } from "../middlewares/error.middleware";

export function listSubjects(userId: string) {
  return prisma.subject.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export async function getSubject(userId: string, id: string) {
  const subject = await prisma.subject.findFirst({ where: { id, userId } });
  if (!subject) {
    throw new HttpError(404, "Subject not found");
  }
  return subject;
}

export function createSubject(userId: string, data: { name: string; color?: string }) {
  return prisma.subject.create({ data: { ...data, userId } });
}

export async function updateSubject(
  userId: string,
  id: string,
  data: { name?: string; color?: string },
) {
  await getSubject(userId, id); // valida ownership y existencia
  return prisma.subject.update({ where: { id }, data });
}

export async function deleteSubject(userId: string, id: string) {
  await getSubject(userId, id);

  const assignmentCount = await prisma.assignment.count({ where: { subjectId: id } });
  if (assignmentCount > 0) {
    throw new HttpError(409, "Cannot delete a subject that still has assignments");
  }

  await prisma.subject.delete({ where: { id } });
}
