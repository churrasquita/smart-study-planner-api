# Smart Study Planner API
<img align="right" width=180px alt="Unicorn" src="https://media1.tenor.com/m/8druEACXtX8AAAAd/michi-cat-meme.gif" />
API REST para organizar el estudio universitario: ramos, evaluaciones, sesiones de estudio, metas, recordatorios y analytics.

## Stack

- Node.js + TypeScript + Express
- PostgreSQL + Prisma ORM
- Autenticación con JWT (access + refresh tokens)
- Validación con Zod
- Rate limiting con `express-rate-limit`
- Documentación con OpenAPI (`swagger-jsdoc` + `swagger-ui-express`)
- Tests con Jest + Supertest

## Modelo de datos

```
User 1—N Subject 1—N Assignment
Subject 1—N StudySession    (Assignment 1—N StudySession, opcional)
User 1—N Goal   (Subject 1—N Goal, opcional)
Assignment/Goal 1—N Reminder
```

Ver [prisma/schema.prisma](prisma/schema.prisma) para el detalle completo de campos e índices.

## Endpoints

| Recurso | Rutas | Auth |
|---|---|---|
| Auth | `POST /auth/register`, `/login`, `/refresh` | No |
| Subjects | `GET/POST /subjects`, `GET/PATCH/DELETE /subjects/:id` | Sí |
| Assignments | `GET/POST /subjects/:id/assignments`, `GET/PATCH/DELETE /assignments/:id`, `GET /assignments/upcoming`, `GET /assignments/overdue` | Sí |
| Study Sessions | `POST /study-sessions`, `GET /study-sessions/today`, `GET /study-sessions/statistics` | Sí |
| Goals | `GET/POST /goals`, `GET/PATCH/DELETE /goals/:id` | Sí |
| Reminders | `GET/POST /reminders`, `DELETE /reminders/:id` | Sí |
| Analytics | `GET /analytics/weekly`, `/productivity`, `/time-per-subject` | Sí |

Solo `/auth/*` es público — todo lo demás pasa por el middleware `requireAuth`.

## Setup

### 1. Requisitos

- Node.js 20+
- PostgreSQL corriendo localmente (o Docker)

### 2. Instalar dependencias

```bash
npm install
```

### 3. Variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tu propia `DATABASE_URL` y genera secretos JWT reales.

### 4. Base de datos

```bash
npm run prisma:migrate
```

Esto crea las tablas según `prisma/schema.prisma` y genera el cliente de Prisma.

### 5. Levantar el servidor en desarrollo

```bash
npm run dev
```

- API en `http://localhost:3000`
- Documentación OpenAPI en `http://localhost:3000/docs`
- Health check en `http://localhost:3000/health`

### 6. Probar el flujo de auth

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"supersecret123","name":"Test"}'
```

Usa el `accessToken` de la respuesta como `Authorization: Bearer <token>` para llamar a `/subjects`.

## Testing

Los tests de `tests/auth.test.ts` corren contra una base de datos real (no se mockea Prisma), para detectar problemas reales de constraints y relaciones. Usa una base de datos de test separada:

```bash
# en .env o como variable de entorno antes de correr los tests
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/smart_study_planner_test"
```

```bash
npm run prisma:migrate
npm test
```