import {Router} from "express";
import{
  deleteHandler,
  getHandler,
  overdueHandler,
  updateHandler,
  upcomingHandler,
} from "../controllers/assignment.controller";

export const assignmentRouter = Router();

/**
 * @openapi
 * /assignments/upcoming:
 *   get:
 *     summary: Lista assignments próximos a vencer (no completados)
 *     tags: [Assignments]
 *     parameters:
 *       - in: query
 *         name: days
 *         schema: { type: integer, default: 7 }
 *     responses:
 *       200: { description: Lista de assignments próximos }
 */
assignmentRouter.get("/upcoming", upcomingHandler);

/**
 * @openapi
 * /assignments/overdue:
 *   get:
 *     summary: Lista assignments vencidos y no completados
 *     tags: [Assignments]
 *     responses:
 *       200: { description: Lista de assignments vencidos }
 */
assignmentRouter.get("/overdue", overdueHandler);

/**
 * @openapi
 * /assignments/{id}:
 *   get:
 *     summary: Obtiene un assignment por id
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: {type: string}
 *     responses:
 *       200: {description: Assignment encontrado}
 *       404: {description: No encontrado}
 *   patch:
 *     summary: Actualiza un assignment
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: {type: string}
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: {type: string}
 *               description: {type: string}
 *               dueDate: {type: string, format: date-time}
 *               status: {type: string, enum: [PENDING, IN_PROGRESS, COMPLETED] }
 *     responses:
 *       200: {description: Assignment actualizado}
 *       404: {description: No encontrado}
 *   delete:
 *     summary: Elimina un assignment
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: {type: string}
 *     responses:
 *       204: {description: Eliminado}
 *       404: {description: No encontrado}
 */
assignmentRouter.get("/:id", getHandler);
assignmentRouter.patch("/:id", updateHandler);
assignmentRouter.delete("/:id", deleteHandler);
