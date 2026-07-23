import { Router } from "express";
import { createHandler, statisticsHandler, todayHandler } from "../controllers/studySession.controller";

export const studySessionRouter = Router();
/**
 * @openapi
 * /study-sessions:
 *   post:
 *     summary: Registra una sesión de estudio
 *     tags: [Study Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [subjectId, startedAt, durationMinutes]
 *             properties:
 *               subjectId: { type: string }
 *               assignmentId: { type: string, description: "Opcional, debe pertenecer al mismo subject" }
 *               startedAt: { type: string, format: date-time }
 *               durationMinutes: { type: integer }
 *               notes: { type: string }
 *     responses:
 *       201: { description: Sesión registrada }
 *       404: { description: Subject o assignment no encontrado }
 */
studySessionRouter.post("/", createHandler);

/**
 * @openapi
 * /study-sessions/today:
 *   get:
 *     summary: Lista las sesiones de estudio de hoy
 *     tags: [Study Sessions]
 *     responses:
 *       200: { description: Sesiones de hoy }
 */
studySessionRouter.get("/today", todayHandler);

/**
 * @openapi
 * /study-sessions/statistics:
 *   get:
 *     summary: Estadísticas de estudio (minutos totales y por ramo)
 *     tags: [Study Sessions]
 *     parameters:
 *       - in: query
 *         name: range
 *         schema: { type: string, enum: [week, month], default: week }
 *     responses:
 *       200: { description: Estadísticas del rango solicitado }
 */
studySessionRouter.get("/statistics", statisticsHandler);
