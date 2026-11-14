import { PrismaClient, type Difficulty } from "@prisma/client";
import bcrypt from "bcryptjs";

import parte1 from "./data/preguntas-parte1.json";
import parte2 from "./data/preguntas-parte2.json";
import parte3 from "./data/preguntas-parte3.json";

const prisma = new PrismaClient();

type PreguntaJson = {
  dificultad: string;
  pregunta: string;
  opciones: string[];
  correcta: number;
  explicacion: string;
  referencia: string;
};

type TemaJson = {
  nombre: string;
  descripcion: string;
  preguntas: PreguntaJson[];
};

type ParteJson = {
  categoria: string;
  descripcion: string;
  fuente: string;
  temas: TemaJson[];
};

const PARTES: ParteJson[] = [
  parte1 as ParteJson,
  parte2 as ParteJson,
  parte3 as ParteJson,
];

/**
 * Vacía por completo el contenido didáctico anterior (preguntas, opciones,
 * intentos, favoritos, simulacros, temas y categorías). Conserva los usuarios.
 *
 * El orden respeta las claves foráneas; además, la mayoría de relaciones
 * tienen borrado en cascada.
 */
async function vaciarContenidoAnterior() {
  await prisma.attemptAnswer.deleteMany();
  await prisma.examAttempt.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.answerOption.deleteMany();
  await prisma.question.deleteMany();
  await prisma.examConfig.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.category.deleteMany();
}

async function main() {
  console.log("🌱 Iniciando seed del temario oficial AESA A1/A3...");

  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@drontest.es" },
    update: {},
    create: {
      email: "admin@drontest.es",
      name: "Administrador",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`✅ Usuario admin disponible: ${admin.email}`);

  await vaciarContenidoAnterior();
  console.log("🗑️  Eliminadas las preguntas, opciones, intentos, favoritos y simulacros anteriores.");

  const categoriasCreadas: Array<{ id: string; nombre: string; preguntas: number }> = [];

  for (const [indiceParte, parte] of PARTES.entries()) {
    const categoria = await prisma.category.create({
      data: {
        name: parte.categoria,
        description: parte.descripcion,
        order: indiceParte + 1,
        isActive: true,
      },
    });

    let totalPreguntasParte = 0;

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
            difficulty: pregunta.dificultad as Difficulty,
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
        totalPreguntasParte++;
      }
    }

    categoriasCreadas.push({
      id: categoria.id,
      nombre: categoria.name,
      preguntas: totalPreguntasParte,
    });
    console.log(`✅ ${categoria.name}: ${parte.temas.length} temas, ${totalPreguntasParte} preguntas.`);
  }

  // Simulacro oficial: 40 preguntas, 4 opciones, 75 % de aciertos.
  // `duration` se guarda en segundos (40 min = 2400 s), igual que el resto de la app.
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
      descripcion: "25 preguntas de normativa, categorías, clases, edades, registro y responsabilidades.",
      categoria: categoriasCreadas[0],
      questionCount: 25,
      duration: 1800,
    },
    {
      nombre: "Práctica Parte 2 — Conocimientos generales",
      descripcion: "25 preguntas de vuelo, UAS, espacio aéreo, factores humanos, privacidad, seguridad y seguros.",
      categoria: categoriasCreadas[1],
      questionCount: 25,
      duration: 1800,
    },
    {
      nombre: "Práctica Parte 3 — Procedimientos operacionales",
      descripcion: "20 preguntas de procedimientos previos, durante el vuelo, contingencias y posteriores al vuelo.",
      categoria: categoriasCreadas[2],
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

  console.log("✅ 4 configuraciones de examen creadas (1 simulacro oficial + 3 prácticas por parte).");

  const total = categoriasCreadas.reduce((suma, categoria) => suma + categoria.preguntas, 0);
  console.log(`🎉 Seed completado: ${total} preguntas publicadas en ${categoriasCreadas.length} categorías.`);
}

main()
  .catch((e) => {
    console.error("❌ Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
