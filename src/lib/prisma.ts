import { PrismaClient } from "@prisma/client";

// Un solo PrismaClient para toda la app (evita agotar conexiones con ts-node-dev/hot-reload).
export const prisma = new PrismaClient();
