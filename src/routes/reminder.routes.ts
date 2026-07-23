import { Router } from "express";
import { createHandler, deleteHandler, listHandler } from "../controllers/reminder.controller";

export const reminderRouter = Router();

/**
 * @openapi
 * /reminders:
 *   get:
 *     summary: Lista los recordatorios del usuario autenticado
 *     tags: [Reminders]
 *     responses:
 *       200: { description: Lista de recordatorios }
 *   post:
 *     summary: Crea un recordatorio para un assignment o un goal (exactamente uno de los dos)
 *     tags: [Reminders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [remindAt, message]
 *             properties:
 *               assignmentId: { type: string }
 *               goalId: { type: string }
 *               remindAt: { type: string, format: date-time }
 *               message: { type: string }
 *     responses:
 *       201: { description: Recordatorio creado }
 *       400: { description: Debe especificar exactamente uno de assignmentId/goalId }
 *       404: { description: Assignment o goal no encontrado }
 */
reminderRouter.get("/", listHandler);
reminderRouter.post("/", createHandler);

/**
 * @openapi
 * /reminders/{id}:
 *   delete:
 *     summary: Elimina un recordatorio
 *     tags: [Reminders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Eliminado }
 *       404: { description: No encontrado }
 */
reminderRouter.delete("/:id", deleteHandler);
