# ---- build stage: compila TypeScript y genera el cliente de Prisma ----
FROM node:20-alpine AS build
WORKDIR /app

# bcrypt tiene un binding nativo (node-gyp) que necesita estas herramientas para compilar.
# openssl es necesario para que Prisma detecte la versión correcta y descargue el motor
# adecuado — sin él, Alpine no trae el comando `openssl` y Prisma asume mal la versión.
RUN apk add --no-cache python3 make g++ openssl

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Deja solo dependencias de producción, pero conserva el cliente de Prisma ya generado.
RUN npm prune --omit=dev

# ---- runtime stage: imagen final, sin herramientas de build ni devDependencies ----
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache openssl

COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/prisma ./prisma
COPY --chown=node:node package.json ./

EXPOSE 3000
USER node

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
