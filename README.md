# DronTest

Aplicación web para practicar exámenes tipo test relacionados con la formación de pilotos de drones y los contenidos aplicables de AESA en España (categorías A1/A3, entre otras).

> **Aviso:** DronTest es una herramienta de práctica independiente. **No es una aplicación oficial, certificada ni avalada por AESA**, y no usa logotipos ni sugiere ninguna afiliación con AESA.

## Funcionalidades

**Área del alumno**
- Práctica por categoría y tema, con número de preguntas configurable.
- Simulacros cronometrados con entrega y corrección al finalizar.
- Resultados con aciertos, errores y explicaciones; revisión de respuestas.
- Historial de intentos, favoritos y estadísticas por categoría/tema.

**Panel de administración** (solo rol `ADMIN`)
- CRUD de categorías, temas, preguntas, opciones y configuraciones de examen.
- Búsqueda y filtros, publicación/archivado de preguntas.
- Importación y exportación en JSON con validación previa.

**Motor de exámenes**
- Selección de preguntas según configuración (número, duración, nota de aprobación por categoría/modalidad).
- Instantánea de las preguntas en cada intento: los resultados históricos no cambian si una pregunta se modifica después.
- Puntuación y validación de la entrega 100% en el servidor; las respuestas correctas no se envían al navegador mientras el examen está activo.
- Reanudación idempotente y atómica del intento si la página se recarga o el arranque se dispara dos veces (doble efecto de React StrictMode en desarrollo).

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript estricto
- Tailwind CSS 4 + shadcn/ui
- PostgreSQL 16 (Docker Compose)
- Prisma ORM (migraciones versionadas)
- Auth.js (sesión por JWT, provider de credenciales + bcrypt)
- Zod para validación en los límites de confianza

## Prerrequisitos

- Node.js 20+
- Docker y Docker Compose (para PostgreSQL)

## Instalación local

```bash
# 1. Dependencias
npm install

# 2. Variables de entorno
cp .env.example .env
# Edita .env si quieres cambiar usuario, contraseña o puerto de PostgreSQL.

# 3. Base de datos
docker compose up -d

# 4. Cliente Prisma y migraciones
npm run db:generate
npm run db:migrate

# 5. Datos iniciales (opcional, ver nota sobre el seed)
npm run db:seed

# 6. Servidor de desarrollo
npm run dev
# http://localhost:3000
```

## Variables de entorno

| Variable | Descripción | Por defecto |
|---|---|---|
| `POSTGRES_USER` | Usuario de PostgreSQL | `drontest` |
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL | definida en `.env` |
| `POSTGRES_DB` | Nombre de la base de datos | `drontest` |
| `POSTGRES_PORT` | Puerto expuesto del contenedor | `5433` |
| `DATABASE_URL` | String de conexión Prisma | `postgresql://…@localhost:5433/drontest?schema=public` |
| `NEXTAUTH_SECRET` | Secreto de sesión (obligatorio en producción) | — |
| `NEXTAUTH_URL` | URL pública de la app | `http://localhost:3000` |

> No incluyas secretos reales en el repositorio. `.env.example` no contiene valores sensibles.

## Base de datos

- **Migraciones:** `npm run db:migrate` (desarrollo) o `npx prisma migrate deploy` (producción). Las migraciones están versionadas en `prisma/migrations/`; no dependan de cambios manuales en producción.
- **Seed:** `npm run db:seed` crea 1 admin (`admin@drontest.es` / `admin123`, solo para desarrollo) y carga el banco completo del temario oficial AESA A1/A3 desde `prisma/data/*.json` (280 preguntas, 3 categorías, 24 temas y 4 configuraciones de examen). **Es un seed destructivo del contenido didáctico:** elimina preguntas, opciones, intentos, favoritos, simulacros, temas y categorías anteriores, pero conserva los usuarios.
- **Estudio de datos:** `npm run db:studio`.

## Fuente de los datos del banco de preguntas

El banco activo de la BD se genera íntegramente desde el temario oficial del curso **UAS-Certificación A1/A3** de AESA y `npm run db:seed` lo carga desde los JSON de `prisma/data/`.

- **Fuente documental:** `docs/temario-a1a3/` — texto del temario oficial de AESA (ver su `README.md`). Contiene las tres partes del curso:
  - **Parte 1 — Concepto normativo** (FOR-UAS-P01-DT01, Ed. 09, julio 2024): 55 diapositivas.
  - **Parte 2 — Conocimientos generales** (lección 2): 85 diapositivas.
  - **Parte 3 — Procedimientos operacionales** (versión 4, noviembre 2022): 21 diapositivas.
- **Banco activo:** `prisma/data/preguntas-parte1.json` (91 preguntas), `preguntas-parte2.json` (141) y `preguntas-parte3.json` (48). Total: **280 preguntas** en 3 categorías y 24 temas, cada una con 4 opciones, una sola correcta, explicación y referencia a la diapositiva del temario. Ver `prisma/data/README.md` para el detalle de temas y trazabilidad.
- **Configuraciones de examen:** 1 simulacro oficial (40 preguntas, 40 minutos, 75 % de aciertos) y 3 prácticas por parte (25, 25 y 20 preguntas).
- **Naturaleza del contenido:** las preguntas están elaboradas a partir del material público de formación de AESA, **no** son preguntas oficiales del examen de AESA. La referencia a la diapositiva de origen se guarda en los campos `reference` y `source` de la BD.
- **Documentación histórica:** `docs/categorias/abierta/a1a3/banco-preguntas.md` (antiguo banco de 95 preguntas) queda **obsoleto** y se conserva solo como referencia. El banco operativo es el de `prisma/data/`.
- **Estructura por categorías:** `docs/categorias/` describe otras categorías y subcategorías (Abierta A2, Específica STS/General, Radiofonista UAS). Por ahora solo **A1/A3** tiene banco cargado; el resto están documentadas (parámetros del examen y requisitos) con el banco **por generar/por definir**.

## Scripts

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo (Turbopack) |
| `npm run build` | Compilación para producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | ESLint |
| `npm run db:generate` | Genera el cliente Prisma |
| `npm run db:migrate` | Crea/aplica migraciones (dev) |
| `npm run db:seed` | Carga datos iniciales |
| `npm run db:studio` | Prisma Studio |

## Estructura del proyecto

```
prisma/            schema.prisma, migraciones, seed y data/ (banco A1/A3 en JSON)
src/
  app/
    login, register, dashboard, practica, simulacros, resultados,
    favoritos, historial, estadisticas, admin/ (panel protegido)
    api/           routes REST (auth, questions, categories, topics,
                   exams, favorites, stats, import, export)
  components/      ui (shadcn), exam, layout, admin
  lib/             prisma, auth, session-provider, validaciones (Zod)
  services/        exam-service, stats-service, question-service,
                   category-service, topic-service, exam-config-service
docs/              temario AESA (temario-a1a3/), material y bancos documentados
```

Separación de responsabilidades: interfaz → API routes → servicios de negocio → Prisma. Las reglas de negocio (selección de preguntas, puntuación, aprobado/no aprobado, expiración) viven en los servicios, en el servidor.

## Pruebas y calidad

- Verificaciones ejecutadas: `tsc --noEmit`, `npm run lint`, `npm run build` y pruebas manuales end-to-end (login → simulacro → entrega → resultados → revisión, flujos admin).
- **Pendiente:** suite de tests automatizados (Vitest para reglas de negocio —puntuación, aprobado, selección de preguntas— y Playwright para flujos críticos). Ver `IMPLEMENTATION_PLAN.md`.

## Copias de seguridad y restauración

```bash
# Copia de seguridad
docker exec drontest-postgres pg_dump -U drontest drontest > backup-YYYYMMDD.sql

# Restauración
docker exec -i drontest-postgres psql -U drontest -d drontest < backup-YYYYMMDD.sql
```

El volumen `postgres_data` de Docker Compose persiste los datos entre reinicios del contenedor.

## Imagen Docker todo en uno

La imagen incluye la aplicación, PostgreSQL 16 y el banco de 280 preguntas, sin
servicios externos. Solo hay que indicar el email y la contraseña de la cuenta
administradora:

```bash
docker run -d --name drontest -p 3000:3000 \
  -e ADMIN_EMAIL=tu@email.com \
  -e ADMIN_PASSWORD=una-clave-segura \
  -v drontest-data:/data \
  raulya/drontest:latest
```

Abre `http://localhost:3000`. El primer arranque tarda entre 20 y 60 segundos:
inicializa PostgreSQL y carga el banco. Se puede seguir con
`docker logs -f drontest`; cuando `docker ps` muestre `healthy`, está lista.

### Variables de entorno

| Variable | Obligatoria | Descripción |
|---|---|---|
| `ADMIN_PASSWORD` | **Sí** | Contraseña de la cuenta administradora. Sin ella el contenedor no arranca. |
| `ADMIN_EMAIL` | No | Email del administrador. Por defecto: `admin@drontest.local`. |
| `PORT` | No | Puerto interno de la aplicación. Por defecto: `3000`. |
| `DATABASE_URL` | No | PostgreSQL externo. Si se define, no se levanta el PostgreSQL embebido. |
| `NEXTAUTH_URL` | No | URL pública de la aplicación. Por defecto: `http://localhost:3000`. |
| `NEXTAUTH_SECRET` | No | Secreto de sesión. Si no se indica, se genera y se guarda en `/data`. |
| `DATA_DIR` | No | Directorio de datos persistentes. Por defecto: `/data`. |

La cuenta de `ADMIN_EMAIL` se crea o actualiza en cada arranque con rol `ADMIN`.
Sirve también para recuperar el acceso si se olvida la contraseña: basta con
recrear el contenedor con una `ADMIN_PASSWORD` nueva.

### Persistencia y actualización

El volumen `/data` guarda PostgreSQL y el secreto de sesión:

```bash
-v drontest-data:/data
```

Sin volumen, los datos se pierden al eliminar el contenedor. La carga del banco
es idempotente: solo ocurre si la base de datos está vacía, así que reiniciar o
actualizar la imagen no borra nada.

```bash
docker pull raulya/drontest:latest
docker rm -f drontest
docker run -d --name drontest -p 3000:3000 \
  -e ADMIN_EMAIL=tu@email.com \
  -e ADMIN_PASSWORD=una-clave-segura \
  -v drontest-data:/data \
  raulya/drontest:latest
```

### Copias de seguridad y reinicio de datos

```bash
# Copia de seguridad
docker exec drontest pg_dump -h 127.0.0.1 -U drontest drontest > backup.sql

# Restauración
docker exec -i drontest psql -h 127.0.0.1 -U drontest -d drontest < backup.sql

# Empezar de cero
docker rm -f drontest
docker volume rm drontest-data
```

### Publicación en Docker Hub

Descripción corta de la ficha:

```text
Simulador de exámenes AESA A1/A3 con 280 preguntas y PostgreSQL incluido.
```

La descripción completa puede ser este mismo apartado. Para publicar:

```bash
docker tag drontest-a1a3:latest raulya/drontest:latest
docker push raulya/drontest:latest
```

La imagen está construida para `linux/amd64`. En un Mac con Apple Silicon Docker
la ejecutará por emulación; para soporte nativo ARM habría que reconstruirla con
`docker buildx` para `linux/amd64,linux/arm64`.

## Despliegue (producción)

```bash
npm run build
npm run start
```

Requisitos mínimos de producción:
- PostgreSQL accesible (mismos datos de conexión vía `DATABASE_URL`).
- `NEXTAUTH_SECRET` con un valor aleatorio fuerte.
- `NEXTAUTH_URL` con la URL pública (https recomendado).
- Aplicar migraciones antes de arrancar: `npx prisma migrate deploy`.
- No usar las credenciales de desarrollo del seed en producción; crear el admin por otro medio seguro.

## Documentación adicional

- `AGENTS.md` — reglas de desarrollo del proyecto.
- `IMPLEMENTATION_PLAN.md` — plan de implementación y estado de las tareas.
- `docs/categorias/` — documentación por categoría y subcategoría. El banco A1/A3 activo ya **no** está ahí: se genera desde el temario oficial y vive en `prisma/data/`. El antiguo `docs/categorias/abierta/a1a3/banco-preguntas.md` está obsoleto.
