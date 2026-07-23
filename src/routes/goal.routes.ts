import {Router } from "express";
import {
  createHandler,
  deleteHandler,
  getHandler,
  listHandler,
  updateHandler,
} from "../controllers/goal.controller";

export const goalRouter = Router();

/**
 * @openapi
 * /goals:
 *   get:
 *     summary: Lista las metas del usuario autenticado
 *     tags: [Goals]
 *     responses:
 *       200: { description: Lista de metas }
 *   post:
 *     summary: Crea una nueva meta
 *     tags: [Goals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               subjectId: { type: string, description: "Opcional, ata la meta a un ramo" }
 *               targetDate: { type: string, format: date-time }
 *     responses:
 *       201: { description: Meta creada }
 *       400: { description: Validación fallida }
 *       404: { description: Subject no encontrado (si se especifica subjectId) }
 */
goalRouter.get("/", listHandler);
goalRouter.post("/", createHandler);

/**
 * @openapi
 * /goals/{id}:
 *   get:
 *     summary: Obtiene una meta por id
 *     tags: [Goals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Meta encontrada }
 *       404: { description: No encontrada }
 *   patch:
 *     summary: Actualiza una meta (título, progreso, estado, etc.)
 *     tags: [Goals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               progress: { type: integer, minimum: 0, maximum: 100 }
 *               status: { type: string, enum: [ACTIVE, COMPLETED, ABANDONED] }
 *     responses:
 *       200: { description: Meta actualizada }
 *       404: { description: No encontrada }
 *   delete:
 *     summary: Elimina una meta
 *     tags: [Goals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Eliminada }
 *       404: { description: No encontrada }
 */
goalRouter.get("/:id", getHandler);
goalRouter.patch("/:id", updateHandler);
goalRouter.delete("/:id", deleteHandler);
