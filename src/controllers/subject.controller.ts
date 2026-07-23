import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import * as subjectService from "../services/subject.service";

const createSchema = z.object({
  name: z.string().min(1),
  color: z.string().optional(),
});

const updateSchema = createSchema.partial();

export async function listHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const subjects = await subjectService.listSubjects(req.user!.id);
    res.status(200).json(subjects);
  } catch (err) {
    next(err);
  }
}

export async function getHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const subject = await subjectService.getSubject(req.user!.id, req.params.id);
    res.status(200).json(subject);
  } catch (err) {
    next(err);
  }
}

export async function createHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createSchema.parse(req.body);
    const subject = await subjectService.createSubject(req.user!.id, data);
    res.status(201).json(subject);
  } catch (err) {
    next(err);
  }
}

export async function updateHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateSchema.parse(req.body);
    const subject = await subjectService.updateSubject(req.user!.id, req.params.id, data);
    res.status(200).json(subject);
  } catch (err) {
    next(err);
  }
}

export async function deleteHandler(req: Request, res: Response, next: NextFunction) {
  try {
    await subjectService.deleteSubject(req.user!.id, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
