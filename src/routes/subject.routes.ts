import { Router } from "express";
import {
  createHandler,
  deleteHandler,
  getHandler,
  listHandler,
  updateHandler,
} from "../controllers/subject.controller";
import {
  createHandler as createAssignmentHandler,
  listBySubjectHandler as listAssignmentsBySubjectHandler,
} from "../controllers/assignment.controller";

export const subjectRouter = Router();

/**
 * @openapi
 * /subjects:
 *   get:
 *     summary: Lista los ramos del usuario autenticado
 *     tags: [Subjects]
 *     responses:
 *       200:
 *         description: Lista de ramos
 *   post:
 *     summary: Crea un nuevo ramo
 *     tags: [Subjects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               color: { type: string }
 *     responses:
 *       201:
 *         description: Ramo creado
 *       400:
 *         description: Validación fallida
 */
subjectRouter.get("/", listHandler);
subjectRouter.post("/", createHandler);

/**
 * @openapi
 * /subjects/{id}:
 *   get:
 *     summary: Obtiene un ramo por id
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Ramo encontrado }
 *       404: { description: No encontrado }
 *   patch:
 *     summary: Actualiza un ramo
 *     tags: [Subjects]
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
 *               name: { type: string }
 *               color: { type: string }
 *     responses:
 *       200: { description: Ramo actualizado }
 *       404: { description: No encontrado }
 *   delete:
 *     summary: Elimina un ramo (falla si tiene assignments asociados)
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Eliminado }
 *       404: { description: No encontrado }
 *       409: { description: Tiene assignments asociados }
 */
subjectRouter.get("/:id", getHandler);
subjectRouter.patch("/:id", updateHandler);
subjectRouter.delete("/:id", deleteHandler);

/**
 * @openapi
 * /subjects/{id}/assignments:
 *   get:
 *     summary: Lista los assignments de un ramo
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Lista de assignments }
 *       404: { description: Ramo no encontrado }
 *   post:
 *     summary: Crea un assignment para un ramo
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, dueDate]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               dueDate: { type: string, format: date-time }
 *               status: { type: string, enum: [PENDING, IN_PROGRESS, COMPLETED] }
 *     responses:
 *       201: { description: Assignment creado }
 *       404: { description: Ramo no encontrado }
 */
subjectRouter.get("/:id/assignments", listAssignmentsBySubjectHandler);
subjectRouter.post("/:id/assignments", createAssignmentHandler);
