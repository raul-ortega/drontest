# syntax=docker/dockerfile:1
#
# DronTest — simulador de exámenes AESA A1/A3.
#
# Imagen autocontenida: incluye PostgreSQL y el banco de 280 preguntas. Para
# arrancarla solo hay que indicar el usuario y la contraseña del administrador:
#
#   docker run -d -p 3000:3000 \
#     -e ADMIN_EMAIL=tu@email.com \
#     -e ADMIN_PASSWORD=tu-clave \
#     -v drontest-data:/data \
#     usuario/drontest:latest
#
# Si se define DATABASE_URL, se usa esa base de datos externa y no se levanta
# el PostgreSQL embebido.

# ---------------------------------------------------------------------------
# 1. Dependencias
# ---------------------------------------------------------------------------
FROM node:22-alpine AS deps

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# ---------------------------------------------------------------------------
# 2. Compilación
# ---------------------------------------------------------------------------
FROM node:22-alpine AS builder

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Valores dummy solo durante la compilación: el build no conecta a la base de
# datos. No se guardan en la imagen final.
RUN export DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build?schema=public" \
 && export NEXTAUTH_SECRET="build-only-secret" \
 && export NEXTAUTH_URL="http://localhost:3000" \
 && npx prisma generate \
 && mkdir -p docker \
 && npx prisma migrate diff \
      --from-empty \
      --to-schema-datamodel prisma/schema.prisma \
      --script > docker/schema.sql \
 && npm run build

# ---------------------------------------------------------------------------
# 3. Imagen final
# ---------------------------------------------------------------------------
FROM node:22-alpine AS runner

RUN apk add --no-cache \
      postgresql \
      postgresql-client \
      su-exec \
      tini \
      openssl \
      libc6-compat

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    APP_HOSTNAME=0.0.0.0 \
    DATA_DIR=/data \
    PGDATA=/data/pgdata

# Aplicación standalone + estáticos.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Prisma: motor y cliente generados (Next no siempre los rastrea).
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Dependencias que usa docker/bootstrap.mjs fuera del bundle de Next.
COPY --from=builder /app/node_modules/bcryptjs ./node_modules/bcryptjs

# Esquema, banco de preguntas y arranque.
COPY --from=builder /app/prisma/data ./prisma/data
COPY --from=builder /app/docker/schema.sql ./docker/schema.sql
COPY --from=builder /app/docker/bootstrap.mjs ./docker/bootstrap.mjs
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh \
 && mkdir -p /data/pgdata \
 && chown -R postgres:postgres /data

VOLUME ["/data"]

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -q -O /dev/null "http://127.0.0.1:${PORT}/login" || exit 1

ENTRYPOINT ["/sbin/tini", "--", "/usr/local/bin/entrypoint.sh"]
