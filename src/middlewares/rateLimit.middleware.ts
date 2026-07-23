import rateLimit from "express-rate-limit";
import {env} from "../lib/env";

// límite general para toda la API
export const apiRateLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {error: "Too many requests, please try again later." },
});

// límite más para login/register
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60*1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many auth attempts, please try again later." },
});
