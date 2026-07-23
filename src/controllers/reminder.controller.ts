import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import * as reminderService from "../services/reminder.service";

const createSchema = z.object({
  assignmentId: z.string().uuid().optional(),
  goalId: z.string().uuid().optional(),
  remindAt: z.coerce.date(),
  message: z.string().min(1),
});

export async function listHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const reminders = await reminderService.listReminders(req.user!.id);
    res.status(200).json(reminders);
  } catch (err) {
    next(err);
  }
}

export async function createHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createSchema.parse(req.body);
    const reminder = await reminderService.createReminder(req.user!.id, data);
    res.status(201).json(reminder);
  } catch (err) {
    next(err);
  }
}

export async function deleteHandler(req: Request, res: Response, next: NextFunction) {
  try {
    await reminderService.deleteReminder(req.user!.id, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
