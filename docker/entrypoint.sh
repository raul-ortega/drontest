#!/bin/sh
# Arranque del contenedor DronTest.
#
# - Si no se define DATABASE_URL, levanta un PostgreSQL embebido en $PGDATA.
# - Crea el esquema si la base de datos está vacía.
# - Crea/actualiza el administrador con ADMIN_EMAIL y ADMIN_PASSWORD.
# - Carga el banco de preguntas la primera vez.
# - Arranca Next.js en el puerto $PORT (3000 por defecto).

set -eu

log() { echo "[entrypoint] $*"; }

if [ -z "${ADMIN_PASSWORD:-}" ]; then
  echo "[entrypoint] ERROR: falta ADMIN_PASSWORD." >&2
  echo "[entrypoint] Uso: docker run -e ADMIN_EMAIL=tu@email.com -e ADMIN_PASSWORD=tu-clave ..." >&2
  exit 1
fi

export ADMIN_EMAIL="${ADMIN_EMAIL:-admin@drontest.local}"
export ADMIN_PASSWORD
export PORT="${PORT:-3000}"
# Docker define HOSTNAME con el ID del contenedor; el servidor standalone debe
# escuchar en todas las interfaces, así que usamos APP_HOSTNAME para controlarlo.
export HOSTNAME="${APP_HOSTNAME:-0.0.0.0}"

DATA_DIR="${DATA_DIR:-/data}"
PGDATA="${PGDATA:-$DATA_DIR/pgdata}"
mkdir -p "$DATA_DIR"

# Secreto de sesión: se genera una vez y se guarda en el volumen de datos.
if [ -z "${NEXTAUTH_SECRET:-}" ]; then
  SECRET_FILE="$DATA_DIR/nextauth-secret"
  if [ ! -s "$SECRET_FILE" ]; then
    head -c 32 /dev/urandom | base64 | tr -d '\n' > "$SECRET_FILE"
    chmod 600 "$SECRET_FILE"
  fi
  NEXTAUTH_SECRET="$(cat "$SECRET_FILE")"
fi
export NEXTAUTH_SECRET
export NEXTAUTH_URL="${NEXTAUTH_URL:-http://localhost:3000}"

PG_RUNNING=0

if [ -z "${DATABASE_URL:-}" ]; then
  log "PostgreSQL embebido (datos en $PGDATA)"
  mkdir -p "$PGDATA"
  chown postgres:postgres "$PGDATA"

  if [ ! -s "$PGDATA/PG_VERSION" ]; then
    log "inicializando el clúster por primera vez (puede tardar unos segundos)"
    su-exec postgres initdb -D "$PGDATA" -U postgres --auth=trust --encoding=UTF8 --locale=C >/dev/null
  fi

  su-exec postgres pg_ctl -D "$PGDATA" -l "$PGDATA/postgres.log" \
    -o "-c listen_addresses=127.0.0.1 -c port=5432 -c unix_socket_directories=/tmp" \
    -w start
  PG_RUNNING=1

  if ! psql -h 127.0.0.1 -U postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='drontest'" | grep -q 1; then
    psql -h 127.0.0.1 -U postgres -q -c "CREATE ROLE drontest LOGIN PASSWORD 'drontest'"
  fi
  if ! psql -h 127.0.0.1 -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='drontest'" | grep -q 1; then
    createdb -h 127.0.0.1 -U postgres -O drontest drontest
  fi

  export DATABASE_URL="postgresql://drontest:drontest@127.0.0.1:5432/drontest?schema=public"
else
  log "usando DATABASE_URL externa"
fi

# libpq no entiende el parámetro ?schema= de Prisma: lo quitamos solo para psql.
PSQL_URL="$(printf '%s' "$DATABASE_URL" | sed -E 's/([?&])schema=[^&]*&?/\1/; s/\?$//')"

if [ "$(psql "$PSQL_URL" -tAc "SELECT to_regclass('public.\"Category\"')" | tr -d '[:space:]')" = "" ]; then
  log "creando esquema"
  psql "$PSQL_URL" -v ON_ERROR_STOP=1 -q -f /app/docker/schema.sql
fi

log "preparando administrador y datos"
cd /app
node /app/docker/bootstrap.mjs

log "arrancando la aplicación en el puerto $PORT"
node server.js &
NODE_PID=$!

stop() {
  log "deteniendo..."
  kill -TERM "$NODE_PID" 2>/dev/null || true
  wait "$NODE_PID" 2>/dev/null || true
  if [ "$PG_RUNNING" = "1" ]; then
    su-exec postgres pg_ctl -D "$PGDATA" -m fast -w stop >/dev/null 2>&1 || true
  fi
  exit 0
}
trap stop TERM INT

set +e
wait "$NODE_PID"
STATUS=$?
set -e

if [ "$PG_RUNNING" = "1" ]; then
  su-exec postgres pg_ctl -D "$PGDATA" -m fast -w stop >/dev/null 2>&1 || true
fi

exit "$STATUS"
