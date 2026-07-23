import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

function globPath(...segments: string[]): string {
  return path.join(...segments).split(path.sep).join("/");
}

export const openApiSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Smart Study Planner API",
      version: "0.1.0",
      description: "API para organizar el estudio universitario: ramos, evaluaciones, sesiones de estudio, metas y analytics.",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [globPath(__dirname, "../controllers/*.ts"), globPath(__dirname, "../routes/*.ts")],
});
