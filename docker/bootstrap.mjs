/**
 * Arranque de la base de datos dentro del contenedor.
 *
 * 1. Crea el índice único parcial que Prisma no puede expresar en el schema
 *    (un solo intento IN_PROGRESS por usuario y configuración).
 * 2. Crea o actualiza el usuario administrador a partir de ADMIN_EMAIL y
 *    ADMIN_PASSWORD.
 * 3. Si la base de datos está vacía, carga el banco de 280 preguntas y las
 *    configuraciones de examen desde prisma/data/*.json.
 *
 * Es idempotente: se puede ejecutar en cada arranque sin perder datos.
 * Mantiene la misma lógica que prisma/seed.ts (uso local).
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const prisma = new PrismaClient();

const dataDir = new URL("../prisma/data/", import.meta.url);

const PARTES = ["preguntas-parte1.json", "preguntas-parte2.json", "preguntas-parte3.json"].map(
  (nombre) => JSON.parse(readFileSync(fileURLToPath(new URL(nombre, dataDir)), "utf8"))
);

function log(...args) {
  console.log("[bootstrap]", ...args);
}

async function crearIndiceIntentosUnicos() {
  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "ExamAttempt_user_config_in_progress_unique"
      ON "ExamAttempt" ("userId", "examConfigId")
      WHERE "status" = 'IN_PROGRESS'
  `);
}

async function crearAdministrador() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL y ADMIN_PASSWORD son obligatorios");
  }

  const hash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { password: hash, role: "ADMIN" },
    create: {
      email,
      name: email.split("@")[0],
      password: hash,
      role: "ADMIN",
    },
  });

  log(`administrador listo: ${admin.email}`);
}

async function cargarBancoSiVacio() {
  const categorias = await prisma.category.count();
  if (categorias > 0) {
    log(`banco ya cargado (${categorias} categorías); no se toca`);
    return;
  }

  log("base de datos vacía: cargando banco de preguntas A1/A3");

  const creadas = [];

  for (const [indiceParte, parte] of PARTES.entries()) {
    const categoria = await prisma.category.create({
      data: {
        name: parte.categoria,
        description: parte.descripcion,
        order: indiceParte + 1,
        isActive: true,
      },
    });

    let total = 0;

    for (const [indiceTema, tema] of parte.temas.entries()) {
      const topic = await prisma.topic.create({
        data: {
          name: tema.nombre,
          description: tema.descripcion,
          categoryId: categoria.id,
          order: indiceTema + 1,
          isActive: true,
        },
      });

      for (const pregunta of tema.preguntas) {
        await prisma.question.create({
          data: {
            text: pregunta.pregunta,
            topicId: topic.id,
            categoryId: categoria.id,
            difficulty: pregunta.dificultad,
            explanation: pregunta.explicacion,
            reference: pregunta.referencia,
            source: parte.fuente,
            status: "PUBLISHED",
            options: {
              create: pregunta.opciones.map((texto, indiceOpcion) => ({
                text: texto,
                isCorrect: indiceOpcion === pregunta.correcta,
                order: indiceOpcion + 1,
              })),
            },
          },
        });
        total++;
      }
    }

    creadas.push({ id: categoria.id, nombre: categoria.name, preguntas: total });
    log(`${categoria.name}: ${parte.temas.length} temas, ${total} preguntas`);
  }

  await prisma.examConfig.create({
    data: {
      name: "Simulacro oficial A1/A3",
      description:
        "40 preguntas de todas las partes del temario, cuatro opciones y una sola correcta. Aprobado con el 75 % (30 aciertos).",
      categoryId: null,
      topicId: null,
      questionCount: 40,
      duration: 2400,
      passingScore: 0.75,
      isActive: true,
    },
  });

  const practicas = [
    {
      nombre: "Práctica Parte 1 — Concepto normativo",
      descripcion:
        "25 preguntas de normativa, categorías, clases, edades, registro y responsabilidades.",
      categoria: creadas[0],
      questionCount: 25,
      duration: 1800,
    },
    {
      nombre: "Práctica Parte 2 — Conocimientos generales",
      descripcion:
        "25 preguntas de vuelo, UAS, espacio aéreo, factores humanos, privacidad, seguridad y seguros.",
      categoria: creadas[1],
      questionCount: 25,
      duration: 1800,
    },
    {
      nombre: "Práctica Parte 3 — Procedimientos operacionales",
      descripcion:
        "20 preguntas de procedimientos previos, durante el vuelo, contingencias y posteriores al vuelo.",
      categoria: creadas[2],
      questionCount: 20,
      duration: 1500,
    },
  ];

  for (const practica of practicas) {
    await prisma.examConfig.create({
      data: {
        name: practica.nombre,
        description: practica.descripcion,
        categoryId: practica.categoria.id,
        questionCount: practica.questionCount,
        duration: practica.duration,
        passingScore: 0.75,
        isActive: true,
      },
    });
  }

  log(`${creadas.reduce((suma, c) => suma + c.preguntas, 0)} preguntas y 4 configuraciones creadas`);
}

async function main() {
  await crearIndiceIntentosUnicos();
  await crearAdministrador();
  await cargarBancoSiVacio();
}

main()
  .catch((error) => {
    console.error("[bootstrap] ERROR:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
