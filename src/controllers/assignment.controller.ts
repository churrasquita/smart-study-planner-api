import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import * as assignmentService from "../services/assignment.service";

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.coerce.date(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
});

const updateSchema = createSchema.partial();

const upcomingQuerySchema = z.object({
  days: z.coerce.number().int().positive().optional().default(7),
});

//subject.routes.ts como req.params.id 
export async function listBySubjectHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const assignments = await assignmentService.listBySubject(req.user!.id, req.params.id);
    res.status(200).json(assignments);
  } catch (err) {
    next(err);
  }
}

// en subject.routes.ts: req.params.id
export async function createHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createSchema.parse(req.body);
    const assignment = await assignmentService.createAssignment(req.user!.id, req.params.id, data);
    res.status(201).json(assignment);
  } catch (err) {
    next(err);
  }
}

//en assignment.routes.ts: req.params.id es el assignmentId.
export async function getHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const assignment = await assignmentService.getAssignment(req.user!.id, req.params.id);
    res.status(200).json(assignment);
  } catch (err) {
    next(err);
  }
}

export async function updateHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateSchema.parse(req.body);
    const assignment = await assignmentService.updateAssignment(req.user!.id, req.params.id, data);
    res.status(200).json(assignment);
  } catch (err) {
    next(err);
  }
}

export async function deleteHandler(req: Request, res: Response, next: NextFunction) {
  try {
    await assignmentService.deleteAssignment(req.user!.id, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function upcomingHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { days } = upcomingQuerySchema.parse(req.query);
    const assignments = await assignmentService.listUpcoming(req.user!.id, days);
    res.status(200).json(assignments);
  } catch (err) {
    next(err);
  }
}

export async function overdueHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const assignments = await assignmentService.listOverdue(req.user!.id);
    res.status(200).json(assignments);
  } catch (err) {
    next(err);
  }
}
