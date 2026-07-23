import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import * as goalService from "../services/goal.service";

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  subjectId: z.string().uuid().optional(),
  targetDate: z.coerce.date().optional(),
});

const updateSchema = createSchema.partial().extend({
  progress: z.number().int().min(0).max(100).optional(),
  status: z.enum(["ACTIVE", "COMPLETED", "ABANDONED"]).optional(),
});

export async function listHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const goals = await goalService.listGoals(req.user!.id);
    res.status(200).json(goals);
  } catch (err) {
    next(err);
  }
}

export async function getHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const goal = await goalService.getGoal(req.user!.id, req.params.id);
    res.status(200).json(goal);
  } catch (err) {
    next(err);
  }
}

export async function createHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createSchema.parse(req.body);
    const goal = await goalService.createGoal(req.user!.id, data);
    res.status(201).json(goal);
  } catch (err) {
    next(err);
  }
}

export async function updateHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateSchema.parse(req.body);
    const goal = await goalService.updateGoal(req.user!.id, req.params.id, data);
    res.status(200).json(goal);
  } catch (err) {
    next(err);
  }
}

export async function deleteHandler(req: Request, res: Response, next: NextFunction) {
  try {
    await goalService.deleteGoal(req.user!.id, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
