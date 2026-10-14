/**
 * seed-questions.ts — Inserta las 40 preguntas de docs/banco-preguntas-40.md
 *
 * Uso: npx tsx prisma/seed-questions.ts
 *
 * Cada pregunta se upserta por su texto exacto (unique key).
 * Si ya existe, se actualizan opciones y campos derivados.
 */

import { PrismaClient, QuestionStatus } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Parsing helpers
// ---------------------------------------------------------------------------

interface QuestionData {
  text: string;
  options: { text: string; isCorrect: boolean; order: number }[];
  explanation: string;
  reference: string;
  source: string;
  topicId: string;
  categoryId: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

function parseQuestions(mdPath: string): QuestionData[] {
  const content = fs.readFileSync(mdPath, "utf-8");

  // Split by "### Pregunta N"
  const blocks = content.split(/(?=### Pregunta \d+)/);

  const questions: QuestionData[] = [];

  for (const block of blocks) {
    if (!block.trim().startsWith("### Pregunta")) continue;

    // Extract question number
    const numMatch = block.match(/### Pregunta (\d+)/);
    if (!numMatch) continue;
    const num = parseInt(numMatch[1], 10);

    // Extract text (after "**Enunciado:** ")
    const textMatch = block.match(/\*\*Enunciado:\*\*\s*(.+)$/m);
    if (!textMatch) continue;
    const text = textMatch[1].trim();

    // Extract options A) B) C) D)  format: "- A) text"
    const optionLines = block.match(/^- [A-D]\)\s*(.+)$/gm);
    if (!optionLines || optionLines.length < 4) {
      console.warn(`⚠️  Pregunta ${num}: no se encontraron 4 opciones (encontrados ${optionLines?.length || 0})`);
      console.warn(`   Bloque (primeras 200 chars): ${block.substring(0, 200)}`);
      continue;
    }

    const options = optionLines.map((line, i) => {
      const m = line.match(/^- ([A-D])\)\s*(.+)$/);
      return m ? { letter: m[1] as "A" | "B" | "C" | "D", text: m[2].trim() } : null;
    }).filter(Boolean) as { letter: "A" | "B" | "C" | "D"; text: string }[];

    // Extract correct answer (after "**Correcta:** ")
    const correctMatch = block.match(/\*\*Correcta:\*\*\s*([A-D])/);
    if (!correctMatch) {
      console.warn(`⚠️  Pregunta ${num}: no se encontró respuesta correcta`);
      continue;
    }
    const correctLetter = correctMatch[1];

    // Extract explanation (after "**Explicación:** ")
    const explMatch = block.match(/\*\*Explicación:\*\*\s*(.+)$/m);
    const explanation = explMatch ? explMatch[1].trim() : "";

    // Extract source (after "**Fuente:** ")
    const sourceMatch = block.match(/\*\*Fuente:\*\*\s*(.+)$/m);
    const source = sourceMatch ? sourceMatch[1].trim() : "";

    // Build option objects
    const optionObjects = options.map((o, i) => ({
      text: o.text,
      isCorrect: o.letter === correctLetter,
      order: i + 1,
    }));

    // Determine category/topic from section headers
    // We'll map below using the section structure
    questions.push({
      text,
      options: optionObjects,
      explanation,
      reference: source,
      source: "FOR-UAS-P01-DT01_Ed.09, Versión 9 (Julio 2024)",
      topicId: "", // filled below
      categoryId: "", // filled below
      difficulty: num <= 20 ? "EASY" : num <= 30 ? "MEDIUM" : "HARD",
    });
  }

  return questions;
}

// ---------------------------------------------------------------------------
// Category / Topic mapping (by question number ranges)
// ---------------------------------------------------------------------------

interface CatTopic {
  categoryId: string;
  topicId: string;
}

// Mapped by question number ranges:
//  1-13: Concepto Normativo (Marco Legal or Limitaciones de Vuelo)
// 14-27: Meteorología y Medio Ambiente (Meteo or Acústica)
// 28-40: Procedimientos Operacionales (Planificación or Operaciones Especiales)
const mapping: Record<number, CatTopic> = {
  // 1-4: Marco Legal
  1: { categoryId: "cmv82ie3i00052vd9fwzfahv8", topicId: "" },
  2: { categoryId: "cmv82ie3i00052vd9fwzfahv8", topicId: "" },
  3: { categoryId: "cmv82ie3i00052vd9fwzfahv8", topicId: "" },
  4: { categoryId: "cmv82ie3i00052vd9fwzfahv8", topicId: "" },
  // 5-7: Limitaciones de Vuelo
  5: { categoryId: "cmv82ie3l00072vd9x7hvfznc", topicId: "" },
  6: { categoryId: "cmv82ie3l00072vd9x7hvfznc", topicId: "" },
  7: { categoryId: "cmv82ie3l00072vd9x7hvfznc", topicId: "" },
  // 8-9: Marco Legal
  8: { categoryId: "cmv82ie3i00052vd9fwzfahv8", topicId: "" },
  9: { categoryId: "cmv82ie3i00052vd9fwzfahv8", topicId: "" },
  // 10-11: Limitaciones de Vuelo
  10: { categoryId: "cmv82ie3l00072vd9x7hvfznc", topicId: "" },
  11: { categoryId: "cmv82ie3i00052vd9fwzfahv8", topicId: "" },
  // 12-13: Limitaciones de Vuelo
  12: { categoryId: "cmv82ie3l00072vd9x7hvfznc", topicId: "" },
  13: { categoryId: "cmv82ie3l00072vd9x7hvfznc", topicId: "" },

  // 14-25: Meteorología Aeronáutica
  14: { categoryId: "cmv82ie3r000d2vd9p0iofimh", topicId: "" },
  15: { categoryId: "cmv82ie3r000d2vd9p0iofimh", topicId: "" },
  16: { categoryId: "cmv82ie3r000d2vd9p0iofimh", topicId: "" },
  17: { categoryId: "cmv82ie3r000d2vd9p0iofimh", topicId: "" },
  18: { categoryId: "cmv82ie3r000d2vd9p0iofimh", topicId: "" },
  19: { categoryId: "cmv82ie3r000d2vd9p0iofimh", topicId: "" },
  20: { categoryId: "cmv82ie3r000d2vd9p0iofimh", topicId: "" },
  21: { categoryId: "cmv82ie3r000d2vd9p0iofimh", topicId: "" },
  22: { categoryId: "cmv82ie3r000d2vd9p0iofimh", topicId: "" },
  23: { categoryId: "cmv82ie3r000d2vd9p0iofimh", topicId: "" },
  24: { categoryId: "cmv82ie3r000d2vd9p0iofimh", topicId: "" },
  25: { categoryId: "cmv82ie3r000d2vd9p0iofimh", topicId: "" },

  // 26-27: Contaminación Acústica
  26: { categoryId: "cmv82ie3u000f2vd9fvfvuna6", topicId: "" },
  27: { categoryId: "cmv82ie3u000f2vd9fvfvuna6", topicId: "" },

  // 28-35: Planificación del Vuelo
  28: { categoryId: "cmv82ie3n00092vd9a7cmrzzj", topicId: "" },
  29: { categoryId: "cmv82ie3n00092vd9a7cmrzzj", topicId: "" },
  30: { categoryId: "cmv82ie3n00092vd9a7cmrzzj", topicId: "" },
  31: { categoryId: "cmv82ie3n00092vd9a7cmrzzj", topicId: "" },
  32: { categoryId: "cmv82ie3n00092vd9a7cmrzzj", topicId: "" },
  33: { categoryId: "cmv82ie3n00092vd9a7cmrzzj", topicId: "" },
  34: { categoryId: "cmv82ie3n00092vd9a7cmrzzj", topicId: "" },
  35: { categoryId: "cmv82ie3n00092vd9a7cmrzzj", topicId: "" },

  // 36-40: Operaciones Especiales
  36: { categoryId: "cmv82ie3p000b2vd9yhodlnt6", topicId: "" },
  37: { categoryId: "cmv82ie3p000b2vd9yhodlnt6", topicId: "" },
  38: { categoryId: "cmv82ie3p000b2vd9yhodlnt6", topicId: "" },
  39: { categoryId: "cmv82ie3p000b2vd9yhodlnt6", topicId: "" },
  40: { categoryId: "cmv82ie3p000b2vd9yhodlnt6", topicId: "" },
};

// ---------------------------------------------------------------------------
// Resolve topicId and categoryId from the mapping
// ---------------------------------------------------------------------------

async function resolveIds(topicId: string, categoryId: string): Promise<CatTopic> {
  // The mapping uses topicId as the key (it's actually the topic ID, not category)
  // Let me fix: the mapping keys are topic IDs
  return { categoryId: "", topicId };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const mdPath = path.join(__dirname, "..", "docs", "banco-preguntas-40.md");
  console.log(`📄 Leyendo ${mdPath}...`);
  const questions = parseQuestions(mdPath);
  console.log(`✅ Se encontraron ${questions.length} preguntas en el archivo.`);

  if (questions.length === 0) {
    console.error("❌ No se encontraron preguntas. Verifica el archivo.");
    process.exit(1);
  }

  // Resolve topic/category IDs
  // The mapping stores topic IDs (the keys are topic IDs)
  // We need to look up the actual topic and category from the DB

  // First, fetch all topics
  const topics = await prisma.topic.findMany({
    include: { category: true },
  });

  // Build a lookup: topic name -> { topicId, categoryId }
  const topicMap = new Map<string, { topicId: string; categoryId: string }>();
  for (const t of topics) {
    topicMap.set(t.name, { topicId: t.id, categoryId: t.categoryId });
  }

  // Also build category name -> id
  const categories = await prisma.category.findMany();
  const catMap = new Map<string, string>();
  for (const c of categories) {
    catMap.set(c.name, c.id);
  }

  console.log(`📚 Temas encontrados: ${topics.map(t => t.name).join(", ")}`);
  console.log(`📁 Categorías: ${categories.map(c => c.name).join(", ")}`);

  // Now map each question to its topic
  // I'll use the section headers in the markdown to determine the mapping
  const sectionHeaders: Record<number, { category: string; topic: string }> = {
    // 1-13: Concepto Normativo
    1: { category: "Concepto Normativo", topic: "Marco Legal" },
    2: { category: "Concepto Normativo", topic: "Marco Legal" },
    3: { category: "Concepto Normativo", topic: "Marco Legal" },
    4: { category: "Concepto Normativo", topic: "Marco Legal" },
    5: { category: "Concepto Normativo", topic: "Limitaciones de Vuelo" },
    6: { category: "Concepto Normativo", topic: "Limitaciones de Vuelo" },
    7: { category: "Concepto Normativo", topic: "Limitaciones de Vuelo" },
    8: { category: "Concepto Normativo", topic: "Marco Legal" },
    9: { category: "Concepto Normativo", topic: "Marco Legal" },
    10: { category: "Concepto Normativo", topic: "Limitaciones de Vuelo" },
    11: { category: "Concepto Normativo", topic: "Marco Legal" },
    12: { category: "Concepto Normativo", topic: "Limitaciones de Vuelo" },
    13: { category: "Concepto Normativo", topic: "Limitaciones de Vuelo" },
    // 14-25: Meteorología Aeronáutica
    14: { category: "Meteorología y Medio Ambiente", topic: "Meteorología Aeronáutica" },
    15: { category: "Meteorología y Medio Ambiente", topic: "Meteorología Aeronáutica" },
    16: { category: "Meteorología y Medio Ambiente", topic: "Meteorología Aeronáutica" },
    17: { category: "Meteorología y Medio Ambiente", topic: "Meteorología Aeronáutica" },
    18: { category: "Meteorología y Medio Ambiente", topic: "Meteorología Aeronáutica" },
    19: { category: "Meteorología y Medio Ambiente", topic: "Meteorología Aeronáutica" },
    20: { category: "Meteorología y Medio Ambiente", topic: "Meteorología Aeronáutica" },
    21: { category: "Meteorología y Medio Ambiente", topic: "Meteorología Aeronáutica" },
    22: { category: "Meteorología y Medio Ambiente", topic: "Meteorología Aeronáutica" },
    23: { category: "Meteorología y Medio Ambiente", topic: "Meteorología Aeronáutica" },
    24: { category: "Meteorología y Medio Ambiente", topic: "Meteorología Aeronáutica" },
    25: { category: "Meteorología y Medio Ambiente", topic: "Meteorología Aeronáutica" },
    // 26-27: Contaminación Acústica
    26: { category: "Meteorología y Medio Ambiente", topic: "Contaminación Acústica" },
    27: { category: "Meteorología y Medio Ambiente", topic: "Contaminación Acústica" },
    // 28-35: Planificación del Vuelo
    28: { category: "Procedimientos Operacionales", topic: "Planificación del Vuelo" },
    29: { category: "Procedimientos Operacionales", topic: "Planificación del Vuelo" },
    30: { category: "Procedimientos Operacionales", topic: "Planificación del Vuelo" },
    31: { category: "Procedimientos Operacionales", topic: "Planificación del Vuelo" },
    32: { category: "Procedimientos Operacionales", topic: "Planificación del Vuelo" },
    33: { category: "Procedimientos Operacionales", topic: "Planificación del Vuelo" },
    34: { category: "Procedimientos Operacionales", topic: "Planificación del Vuelo" },
    35: { category: "Procedimientos Operacionales", topic: "Planificación del Vuelo" },
    // 36-40: Operaciones Especiales
    36: { category: "Procedimientos Operacionales", topic: "Operaciones Especiales" },
    37: { category: "Procedimientos Operacionales", topic: "Operaciones Especiales" },
    38: { category: "Procedimientos Operacionales", topic: "Operaciones Especiales" },
    39: { category: "Procedimientos Operacionales", topic: "Operaciones Especiales" },
    40: { category: "Procedimientos Operacionales", topic: "Operaciones Especiales" },
  };

  let created = 0;
  let updated = 0;

  let idx = 0;
  for (const q of questions) {
    const sectionKey = ++idx; // 1-based index matches question numbers
    const section = sectionHeaders[sectionKey];
    if (!section) {
      console.warn(`⚠️  Pregunta ${sectionKey}: sin mapeo de sección`);
      continue;
    }

    const topicInfo = topicMap.get(section.topic);
    if (!topicInfo) {
      console.error(`❌ Tema "${section.topic}" no encontrado en la BD`);
      continue;
    }

    const { topicId, categoryId } = topicInfo;

    // Check if question already exists
    const existing = await prisma.question.findFirst({
      where: { text: q.text },
    });

    if (existing) {
      // Update existing question
      await prisma.question.update({
        where: { id: existing.id },
        data: {
          topicId,
          categoryId,
          difficulty: q.difficulty,
          explanation: q.explanation,
          reference: q.reference,
          source: q.source,
          status: QuestionStatus.PUBLISHED,
          options: {
            deleteMany: {},
            create: q.options,
          },
        },
      });
      console.log(`🔄 Pregunta ${sectionKey}: actualizada`);
    } else {
      // Create new question
      await prisma.question.create({
        data: {
          text: q.text,
          topicId,
          categoryId,
          difficulty: q.difficulty,
          explanation: q.explanation,
          reference: q.reference,
          source: q.source,
          status: QuestionStatus.PUBLISHED,
          options: {
            create: q.options,
          },
        },
      });
      console.log(`✅ Pregunta ${sectionKey}: creada`);
    }

    console.log(`✅ Pregunta ${sectionKey}: ${q.text.substring(0, 60)}...`);
  }

  // Summary
  const counts = await prisma.question.groupBy({
    by: ["categoryId"],
    _count: { id: true },
  });

  console.log("\n📊 Resumen por categoría:");
  for (const c of counts) {
    const catName = catMap.get(c.categoryId) || c.categoryId;
    console.log(`  ${catName}: ${c._count.id} preguntas`);
  }

  const total = await prisma.question.count();
  console.log(`\n🎉 Total de preguntas en la BD: ${total}`);

  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  });
