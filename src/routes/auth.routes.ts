import { Router } from "express";
import { loginHandler, refreshHandler, registerHandler } from "../controllers/auth.controller";
import { authRateLimiter } from "../middlewares/rateLimit.middleware";

export const authRouter = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 8 }
 *               name: { type: string }
 *     responses:
 *       201:
 *         description: Usuario creado, devuelve accessToken y refreshToken
 *       400:
 *         description: Validación fallida
 *       409:
 *         description: El email ya está registrado
 */
authRouter.post("/register", authRateLimiter, registerHandler);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Inicia sesión con email y contraseña
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve accessToken y refreshToken
 *       401:
 *         description: Credenciales inválidas
 */
authRouter.post("/login", authRateLimiter, loginHandler);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Renueva el accessToken usando un refreshToken válido
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: Nuevo par de tokens
 *       401:
 *         description: Refresh token inválido o expirado
 */
authRouter.post("/refresh", authRateLimiter, refreshHandler);
