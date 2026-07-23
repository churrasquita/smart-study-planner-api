import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import * as studySessionService from "../services/studySession.service";

const createSchema = z.object({
  subjectId: z.string().uuid(),
  assignmentId: z.string().uuid().optional(),
  startedAt: z.coerce.date(),
  durationMinutes: z.number().int().positive(),
  notes: z.string().optional(),
});

const statisticsQuerySchema = z.object({
  range: z.enum(["week", "month"]).optional().default("week"),
});

export async function createHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createSchema.parse(req.body);
    const session = await studySessionService.createStudySession(req.user!.id, data);
    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
}

export async function todayHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const sessions = await studySessionService.listToday(req.user!.id);
    res.status(200).json(sessions);
  } catch (err) {
    next(err);
  }
}

export async function statisticsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { range } = statisticsQuerySchema.parse(req.query);
    const stats = await studySessionService.getStatistics(req.user!.id, range);
    res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
}
