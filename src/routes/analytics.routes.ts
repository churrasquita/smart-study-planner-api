import { Router } from "express";
import {
  productivityHandler,
  timePerSubjectHandler,
  weeklyHandler,
} from "../controllers/analytics.controller";

export const analyticsRouter = Router();

/**
 * @openapi
 * /analytics/weekly:
 *   get:
 *     summary: Minutos estudiados por día en los últimos 7 días
 *     tags: [Analytics]
 *     responses:
 *       200: { description: Serie diaria de minutos estudiados }
 */
analyticsRouter.get("/weekly", weeklyHandler);

/**
 * @openapi
 * /analytics/productivity:
 *   get:
 *     summary: Tasa de cumplimiento de assignments (completados vs total, y vencidos)
 *     tags: [Analytics]
 *     responses:
 *       200: { description: Métricas de productividad }
 */
analyticsRouter.get("/productivity", productivityHandler);

/**
 * @openapi
 * /analytics/time-per-subject:
 *   get:
 *     summary: Minutos totales estudiados por ramo (histórico completo)
 *     tags: [Analytics]
 *     responses:
 *       200: { description: Desglose de minutos por ramo, ordenado de mayor a menor }
 */
analyticsRouter.get("/time-per-subject", timePerSubjectHandler);
