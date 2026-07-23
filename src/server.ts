import { app } from "./app";
import { env } from "./lib/env";

app.listen(env.port, () => {
  console.log(`Smart Study Planner API listening on http://localhost:${env.port}`);
  console.log(`OpenAPI docs available at http://localhost:${env.port}/docs`);
});
