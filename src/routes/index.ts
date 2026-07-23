import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { authRouter } from "./auth.routes";
import { subjectRouter } from "./subject.routes";
import { assignmentRouter } from "./assignment.routes";
import { studySessionRouter } from "./studySession.routes";
import { goalRouter } from "./goal.routes";
import { reminderRouter } from "./reminder.routes";
import { analyticsRouter } from "./analytics.routes";

export const rootRouter = Router();

// Único grupo de rutas públicas
rootRouter.use("/auth", authRouter);

rootRouter.use("/subjects", requireAuth, subjectRouter);
rootRouter.use("/assignments", requireAuth, assignmentRouter);
rootRouter.use("/study-sessions", requireAuth, studySessionRouter);
rootRouter.use("/goals", requireAuth, goalRouter);
rootRouter.use("/reminders", requireAuth, reminderRouter);
rootRouter.use("/analytics", requireAuth, analyticsRouter);
