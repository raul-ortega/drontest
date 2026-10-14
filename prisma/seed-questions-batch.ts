/**
 * seed-questions-batch.ts — Inserta preguntas verificadas desde banco-preguntas.md
 *
 * Uso:
 *   npx tsx prisma/seed-questions-batch.ts                    # inserta todas las verificadas
 *   npx tsx prisma/seed-questions-batch.ts --group A          # solo grupo A
 *   npx tsx prisma/seed-questions-batch.ts --dry              # solo muestra qué se insertaría
 *
 * Las preguntas se insertan si tienen "Estado: [x] Verificada" (o [x] Insertada en BD para reintentos).
 * Al terminar, marca "[x] Insertada en BD" en el archivo.
 */

import { PrismaClient, QuestionStatus } from "@prisma/client";
import fs from "fs";
import { resolve as resolvePath } from "path";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const groupFilter = args.find((a) => a.startsWith("--group="))?.split("=")[1];
const dryRun = args.includes("--dry") || args.includes("--dry-run");

// ---------------------------------------------------------------------------
// Group/topic mapping (module-level)
// ---------------------------------------------------------------------------

const GROUP_MAPPING: Record<string, { category: string; topic: string; difficulty: "EASY" | "MEDIUM" | "HARD" }> = {
  A: { category: "Abierta", topic: "Marco Legal", difficulty: "EASY" },
  B: { category: "Abierta", topic: "Limitaciones de Vuelo", difficulty: "MEDIUM" },
  C: { category: "Abierta", topic: "Meteorología Aeronáutica", difficulty: "MEDIUM" },
  D: { category: "Abierta", topic: "Contaminación Acústica", difficulty: "EASY" },
  E: { category: "Abierta", topic: "Planificación del Vuelo", difficulty: "MEDIUM" },
  F: { category: "Abierta", topic: "Operaciones Especiales", difficulty: "MEDIUM" },
};

const GROUP_RANGES: Record<string, { start: number; end: number }> = {
  A: { start: 1, end: 20 },
  B: { start: 21, end: 40 },
  C: { start: 41, end: 57 },
  D: { start: 58, end: 59 },
  E: { start: 60, end: 79 },
  F: { start: 80, end: 99 },
};

// ---------------------------------------------------------------------------
// Parsing helpers
// ---------------------------------------------------------------------------

interface QuestionData {
  id: string;
  text: string;
  options: { text: string; isCorrect: boolean; order: number }[];
  explanation: string;
  reference: string;
  source: string;
  topicId: string;
  categoryId: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  group: string;
  verified: boolean;
  inserted: boolean;
}

function parseQuestions(mdPath: string): QuestionData[] {
  const content = fs.readFileSync(mdPath, "utf-8");
  const blocks = content.split(/(?=### Q\d{3})/);
  const questions: QuestionData[] = [];

  for (const block of blocks) {
    if (!block.trim().startsWith("### Q")) continue;

    const idMatch = block.match(/### Q(\d{3})/);
    if (!idMatch) continue;
    const id = `Q${idMatch[1]}`;
    const num = parseInt(idMatch[1], 10);

    // Determine group
    let group = "";
    for (const [g, range] of Object.entries(GROUP_RANGES)) {
      if (num >= range.start && num <= range.end) {
        group = g;
        break;
      }
    }
    if (!group) continue;

    // Check verified/inserted status
    const verified = !!block.match(/\[x\]\s*Verificada/);
    const inserted = !!block.match(/\[x\]\s*Insertada en BD/);
    if (!verified) continue;

    // Extract text from "### Q0XX — Enunciado"
    const optMatch = block.match(/\*\*Opciones:\*\*/);
    if (!optMatch) continue;
    const textStart = block.substring(0, optMatch.index);
    const textMatch = textStart.match(/### Q\d{3} — (.+)$/m);
    if (!textMatch) continue;
    const text = textMatch[1].trim();

    // Extract options
    const optionLines = block.match(/^- ([A-D])\)\s*(.+)$/gm);
    if (!optionLines || optionLines.length < 4) continue;

    // Extract correct answer
    const correctMatch = block.match(/\*\*Correcta:\*\*\s*([A-D])/);
    if (!correctMatch) continue;
    const correctLetter = correctMatch[1];

    // Extract explanation
    const explMatch = block.match(/\*\*Explicación:\*\*\s*(.+)$/m);
    const explanation = explMatch ? explMatch[1].trim() : "";

    // Extract source
    const sourceMatch = block.match(/\*\*Fuente:\*\*\s*(.+)$/m);
    const source = sourceMatch ? sourceMatch[1].trim() : "";

    // Determine difficulty
    const diffMatch = block.match(/\*\*Dificultad:\*\*\s*(EASY|MEDIUM|HARD)/);
    const difficulty = (diffMatch ? diffMatch[1] : GROUP_MAPPING[group]?.difficulty) as "EASY" | "MEDIUM" | "HARD";

    // Build option objects
    const parsedOptions = optionLines.map((line) => {
      const m = line.match(/^- ([A-D])\)\s*(.+)$/);
      if (!m) return null;
      return {
        letter: m[1] as "A" | "B" | "C" | "D",
        text: m[2].trim(),
        isCorrect: m[1] === correctLetter,
      };
    }).filter(Boolean) as { text: string; isCorrect: boolean; letter: "A" | "B" | "C" | "D" }[];

    // Assign order numbers
    const options = parsedOptions.map((o, i) => ({ text: o.text, isCorrect: o.isCorrect, order: i + 1 }));

    questions.push({
      id,
      text,
      options,
      explanation,
      reference: source,
      source: "FOR-UAS-P01-DT01_Ed.09, Versión 9 (Julio 2024)",
      topicId: "",
      categoryId: "",
      difficulty,
      group,
      verified,
      inserted,
    });
  }

  return questions;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const mdPath = resolvePath(__dirname, "..", "docs", "categorias", "abierta", "a1a3", "banco-preguntas.md");
  console.log(`📄 Leyendo ${mdPath}...`);

  const allQuestions = parseQuestions(mdPath);
  console.log(`✅ Se encontraron ${allQuestions.length} preguntas verificadas en el archivo.`);

  if (allQuestions.length === 0) {
    console.log("⚠️  No hay preguntas verificadas. Marca [x] Verificada en las preguntas que quieras insertar.");
    process.exit(0);
  }

  const questions = groupFilter
    ? allQuestions.filter((q) => q.group === groupFilter)
    : allQuestions;

  if (groupFilter && questions.length === 0) {
    console.log(`⚠️  No hay preguntas verificadas en el grupo ${groupFilter}.`);
    process.exit(0);
  }

  console.log(`📋 Preguntas a procesar: ${questions.length}${groupFilter ? ` (grupo ${groupFilter})` : ""}`);

  if (dryRun) {
    console.log("\n🔍 DRY RUN — Preguntas que se insertarían:");
    for (const q of questions) {
      console.log(`  ${q.id}: ${q.text.substring(0, 70)}... [${q.group}]`);
    }
    console.log(`\n✅ Total: ${questions.length} preguntas`);
    return;
  }

  // Resolve topic/category IDs from DB
  const topics = await prisma.topic.findMany({ include: { category: true } });
  const topicMap = new Map<string, { topicId: string; categoryId: string }>();
  for (const t of topics) {
    topicMap.set(t.name, { topicId: t.id, categoryId: t.categoryId });
  }

  const categories = await prisma.category.findMany();
  const catMap = new Map<string, string>();
  for (const c of categories) {
    catMap.set(c.name, c.id);
  }

  console.log(`\n📚 Temas: ${topics.map((t) => t.name).join(", ")}`);
  console.log(`📁 Categorías: ${categories.map((c) => c.name).join(", ")}`);

  // Update progress markers in the file
  let fileContent = fs.readFileSync(mdPath, "utf-8");

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const q of questions) {
    const groupInfo = GROUP_MAPPING[q.group];
    if (!groupInfo) {
      console.error(`❌ Grupo "${q.group}" no mapeado`);
      skipped++;
      continue;
    }

    const topicInfo = topicMap.get(groupInfo.topic);
    if (!topicInfo) {
      console.error(`❌ Tema "${groupInfo.topic}" no encontrado en BD`);
      skipped++;
      continue;
    }

    const { topicId, categoryId } = topicInfo;

    // Check if question already exists
    const existing = await prisma.question.findFirst({ where: { text: q.text } });

    if (existing) {
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
          options: { deleteMany: {}, create: q.options },
        },
      });
      updated++;
      console.log(`🔄 ${q.id}: actualizada`);
    } else {
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
          options: { create: q.options },
        },
      });
      created++;
      console.log(`✅ ${q.id}: creada`);
    }

    // Mark as inserted in file
    fileContent = fileContent
      .replace(`**Estado:** [ ] Pendiente`, `**Estado:** [x] Verificada | [x] Insertada en BD`)
      .replace(`**Estado:** [x] Verificada`, `**Estado:** [x] Verificada | [ ] Insertada en BD`)
      .replace(`**Estado:** [x] Verificada | [ ] Insertada en BD`, `**Estado:** [x] Verificada | [x] Insertada en BD`);
  }

  fs.writeFileSync(mdPath, fileContent);

  // Summary
  const counts = await prisma.question.groupBy({ by: ["categoryId"], _count: { id: true } });
  console.log("\n📊 Resumen por categoría:");
  for (const c of counts) {
    console.log(`  ${catMap.get(c.categoryId) || c.categoryId}: ${c._count.id} preguntas`);
  }

  const topicCounts = await prisma.question.groupBy({ by: ["topicId"], _count: { id: true } });
  console.log("\n📊 Resumen por tema:");
  for (const tc of topicCounts) {
    const topicName = topics.find((t) => t.id === tc.topicId)?.name || tc.topicId;
    console.log(`  ${topicName}: ${tc._count.id} preguntas`);
  }

  const total = await prisma.question.count();
  console.log(`\n🎉 Total en BD: ${total} (+${created} nuevas, ${updated} actualizadas)`);
  console.log(`⏭️  Saltadas: ${skipped}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
