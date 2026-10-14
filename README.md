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
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL | `drontest_dev` |
| `POSTGRES_DB` | Nombre de la base de datos | `drontest` |
| `POSTGRES_PORT` | Puerto expuesto del contenedor | `5433` |
| `DATABASE_URL` | String de conexión Prisma | `postgresql://…@localhost:5433/drontest?schema=public` |
| `NEXTAUTH_SECRET` | Secreto de sesión (obligatorio en producción) | — |
| `NEXTAUTH_URL` | URL pública de la app | `http://localhost:3000` |

> No incluyas secretos reales en el repositorio. `.env.example` no contiene valores sensibles.

## Base de datos

- **Migraciones:** `npm run db:migrate` (desarrollo) o `npx prisma migrate deploy` (producción). Las migraciones están versionadas en `prisma/migrations/`; no dependan de cambios manuales en producción.
- **Seed:** `npm run db:seed` crea 1 admin (`admin@drontest.es` / `admin123`, solo para desarrollo), 3 categorías, 6 temas, preguntas de demostración y 1 configuración de examen. **Las preguntas del seed son ficticias** y no se mezclan con el banco real de la BD en vivo.
- **Estudio de datos:** `npm run db:studio`.

## Fuente de los datos del banco de preguntas

El banco real que hay actualmente en la BD (95 preguntas, categoría **Abierta**) **no** proviene del seed: se redactó y verificó a partir del temario de formación de AESA y está documentado en los subdirectorios de `docs/categorias/`.

- **Fuente documental:** `docs/_Formacion.temario.completo.Ed12.pdf` (FOR-UAS-P01-DT01, Ed. 09, julio 2024).
- **Banco verificado:** `docs/categorias/abierta/a1a3/banco-preguntas.md` — 95 preguntas tipo test (A–D), cada una con respuesta correcta, explicación, dificultad y **fuente: cita literal del temario con número de página**.
  - Distribución por tema: Marco Legal (20), Limitaciones de Vuelo (20), Meteorología Aeronáutica (17), Contaminación Acústica (2), Planificación del Vuelo (20), Operaciones Especiales (15), más 1 pregunta de seguro de responsabilidad civil (RD 517/2024, art. 8).
- **Inserción en BD:** `prisma/seed-questions-batch.ts` (script incremental: `npx tsx prisma/seed-questions-batch.ts`, con `--group` y `--dry`). Solo inserta preguntas marcadas como verificadas y deja constancia del estado ("Insertada en BD") en el propio `banco-preguntas.md`.
- **Estructura por categorías:** `docs/categorias/` organiza el banco por categoría y subcategoría (Abierta A1/A3, Abierta A2, Específica STS/General, Radiofonista UAS). Por ahora solo **A1/A3** tiene banco generado; el resto están documentadas (parámetros del examen y requisitos) con el banco **por generar/por definir**.
- **Naturaleza del contenido:** son preguntas elaboradas a partir de documentación pública de AESA, **no** preguntas oficiales de AESA. La procedencia de cada pregunta se conserva en el campo `source` de la BD y en el documento del banco.

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
prisma/            schema.prisma, migraciones, seed
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
docs/              material de formación y banco de preguntas documentado
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
- `docs/categorias/` — banco de preguntas organizado por categoría y subcategoría; el banco real de la BD (A1/A3) está en `docs/categorias/abierta/a1a3/banco-preguntas.md`, verificado contra el temario AESA.
