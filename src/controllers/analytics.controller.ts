import { NextFunction, Request, Response } from "express";
import * as analyticsService from "../services/analytics.service";

export async function weeklyHandler(req: Request, res: Response, next: NextFunction) {
  try{
    const data = await analyticsService.getWeekly(req.user!.id);
    res.status(200).json(data);
  }catch (err) {
    next(err);
  }
}

export async function productivityHandler(req: Request, res: Response, next: NextFunction) {
  try{
    const data = await analyticsService.getProductivity(req.user!.id);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

export async function timePerSubjectHandler(req: Request, res: Response, next: NextFunction) {
  try{
    const data = await analyticsService.getTimePerSubject(req.user!.id);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}
