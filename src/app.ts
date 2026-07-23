import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { rootRouter } from "./routes";
import { apiRateLimiter } from "./middlewares/rateLimit.middleware";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import { openApiSpec } from "./lib/openapi";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(apiRateLimiter);

app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));
app.get("/", (_req, res) => res.redirect("/docs"));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.use(rootRouter);

app.use(notFoundHandler);
app.use(errorHandler);
