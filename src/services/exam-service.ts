import { prisma } from "@/lib/prisma";
import type { Difficulty } from "@prisma/client";

export interface SelectedQuestion {
  id: string;
  text: string;
  difficulty: Difficulty;
  topicId: string;
  categoryId: string;
  options: Array<{ id: string; text: string; isCorrect: boolean; order: number }>;
}

/** Fisher-Yates shuffle in-place */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Selecciona preguntas aleatorias de acuerdo con la configuración del examen.
 * Conserva una instantánea de las preguntas en el attempt.
 *
 * - Si se indica un topicId concreto → selección aleatoria simple de ese topic.
 * - Si solo se indica categoryId o nada → selección proporcional por topic
 *   (cada topic aporta preguntas en proporción a su tamaño en el pool).
 */
export async function selectQuestions(
  categoryId: string | null,
  topicId: string | null,
  count: number
): Promise<SelectedQuestion[]> {
  const where: Record<string, unknown> = { status: "PUBLISHED" };
  if (categoryId) where.categoryId = categoryId;
  if (topicId) where.topicId = topicId;

  const totalAvailable = await prisma.question.count({ where });

  if (totalAvailable < count) {
    throw new Error(
      `Solo hay ${totalAvailable} preguntas disponibles, se necesitan ${count}`
    );
  }

  // Caso específico: topicId indicado → comportamiento original (shuffle simple)
  if (topicId) {
    const allQuestions = await prisma.question.findMany({
      where,
      select: {
        id: true,
        text: true,
        difficulty: true,
        topicId: true,
        categoryId: true,
        options: {
          select: { id: true, text: true, isCorrect: true, order: true },
          orderBy: { order: "asc" },
        },
      },
    });
    return shuffle(allQuestions).slice(0, count);
  }

  // Caso general: selección proporcional por topic
  // 1. Contar preguntas publicadas por topic
  const topicCounts = await prisma.question.groupBy({
    by: ["topicId"],
    where,
    _count: { id: true },
  });

  // 2. Calcular distribución proporcional
  const allocations = computeProportionalAllocation(topicCounts, count);

  // 3. Seleccionar preguntas aleatorias de cada topic
  const selected: SelectedQuestion[] = [];
  for (const { topicId: tid, available, take } of allocations) {
    const questions = await prisma.question.findMany({
      where: { ...where, topicId: tid },
      select: {
        id: true,
        text: true,
        difficulty: true,
        topicId: true,
        categoryId: true,
        options: {
          select: { id: true, text: true, isCorrect: true, order: true },
          orderBy: { order: "asc" },
        },
      },
    });
    selected.push(...shuffle(questions).slice(0, take));
  }

  return selected;
}

/**
 * Calcula cuántas preguntas asignar a cada topic de forma proporcional.
 *
 * Algoritmo:
 *  1. Share proporcional = (count / total) * topicCount
 *  2. floor(share) para cada topic
 *  3. Repartir el resto por la mayor fracción decimal (Hamilton / mayor resto)
 */
function computeProportionalAllocation(
  topicCounts: Array<{ topicId: string; _count: { id: number } }>,
  count: number
): Array<{ topicId: string; available: number; take: number }> {
  const total = topicCounts.reduce((s, t) => s + t._count.id, 0);
  if (total === 0 || count === 0) return [];

  // Paso 1-2: floor del share proporcional
  const raw: Array<{
    topicId: string;
    available: number;
    share: number;
    floor: number;
    frac: number;
  }> = topicCounts.map((t) => ({
    topicId: t.topicId,
    available: t._count.id,
    share: (count / total) * t._count.id,
    floor: Math.floor((count / total) * t._count.id),
    frac: (count / total) * t._count.id - Math.floor((count / total) * t._count.id),
  }));

  // Paso 3: repartir el resto por mayor fracción
  const allocated = raw.reduce((s, r) => s + r.floor, 0);
  let remaining = count - allocated;

  const sorted = [...raw].sort((a, b) => b.frac - a.frac);
  for (const r of sorted) {
    if (remaining <= 0) break;
    r.floor += 1;
    remaining -= 1;
  }

  // Asegurar mínimo 1 si hay disponible y aún sobran
  if (remaining > 0) {
    for (const r of sorted) {
      if (remaining <= 0) break;
      if (r.available > r.floor) {
        r.floor += 1;
        remaining -= 1;
      }
    }
  }

  return raw.map((r) => ({
    topicId: r.topicId,
    available: r.available,
    take: Math.min(r.floor, r.available),
  }));
}

/**
 * Calcula la puntuación del examen SERVER-SIDE.
 * Nunca confía en valores enviados por el cliente.
 */
export async function calculateScore(attemptId: string): Promise<{
  correct: number;
  incorrect: number;
  unanswered: number;
  score: number;
}> {
  const attempt = await prisma.examAttempt.findUnique({
    where: { id: attemptId },
    include: {
      answers: {
        include: {
          question: {
            include: { options: { where: { isCorrect: true } } },
          },
        },
      },
    },
  });

  if (!attempt) {
    throw new Error("Intento no encontrado");
  }

  const totalQuestions = attempt.totalQuestions || 0;
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;

  // Verify each answer against DB correct answers
  for (const answer of attempt.answers) {
    if (!answer.selectedOptionId) {
      unanswered++;
      continue;
    }

    const selectedOption = await prisma.answerOption.findUnique({
      where: { id: answer.selectedOptionId },
    });

    if (selectedOption?.isCorrect) {
      correct++;
    } else {
      incorrect++;
    }
  }

  unanswered = totalQuestions - correct - incorrect;
  const score = totalQuestions > 0 ? (correct / totalQuestions) * 100 : 0;

  return { correct, incorrect, unanswered, score: Math.round(score * 100) / 100 };
}

/**
 * Determina si un intento está aprobado.
 *
 * Unidades: `score` es un porcentaje (0-100) y `passingScore` es una
 * fracción (0-1), tal y como se almacenan en la base de datos.
 */
export function isAttemptPassed(
  score: number | null,
  passingScore: number | null | undefined
): boolean {
  return (score ?? 0) >= (passingScore ?? 0.5) * 100;
}

/**
 * Detecta violaciones de restricción única de Prisma (P2002).
 */
function isUniqueConstraintError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: string }).code === "P2002"
  );
}

async function findInProgressAttempt(userId: string, examConfigId: string) {
  return prisma.examAttempt.findFirst({
    where: { userId, examConfigId, status: "IN_PROGRESS" },
    include: {
      answers: {
        orderBy: { order: "asc" },
        include: {
          question: {
            select: {
              id: true,
              text: true,
              difficulty: true,
              topicId: true,
              categoryId: true,
              options: {
                select: { id: true, text: true, isCorrect: true, order: true },
                orderBy: { order: "asc" },
              },
            },
          },
        },
      },
    },
  });
}

type InProgressAttempt = NonNullable<
  Awaited<ReturnType<typeof findInProgressAttempt>>
>;

/**
 * Construye la respuesta para reanudar un intento IN_PROGRESS: valida el
 * tiempo transcurrido y reconstruye las preguntas desde la instantánea.
 */
async function resumeAttempt(
  existing: InProgressAttempt,
  config: { duration: number; passingScore: number }
) {
  const elapsedSeconds = Math.floor(
    (Date.now() - existing.startTime.getTime()) / 1000
  );
  const remaining = config.duration - elapsedSeconds;

  if (remaining <= 0) {
    // El tiempo se agotó mientras la página estaba cerrada
    await prisma.examAttempt.update({
      where: { id: existing.id },
      data: { status: "EXPIRED", endTime: new Date() },
    });
    throw new Error("El tiempo del examen ha expirado");
  }

  const questions: SelectedQuestion[] = existing.answers.map((a) => ({
    id: a.question.id,
    text: a.question.text,
    difficulty: a.question.difficulty,
    topicId: a.question.topicId,
    categoryId: a.question.categoryId,
    options: a.question.options.map((o) => ({
      id: o.id,
      text: o.text,
      isCorrect: o.isCorrect,
      order: o.order,
    })),
  }));

  return {
    attemptId: existing.id,
    questions,
    duration: remaining,
    passingScore: config.passingScore,
  };
}

/**
 * Crea un nuevo intento de examen, o recupera el intento IN_PROGRESS
 * existente del usuario para esa configuración (idempotente).
 *
 * Persiste una instantánea de las preguntas presentadas (filas
 * AttemptAnswer sin opción elegida), de modo que el intento puede
 * recuperarse tras una recarga y las respuestas enviadas pueden
 * validarse contra las preguntas reales del intento.
 *
 * La idempotencia es atómica: el índice único parcial
 * (userId, examConfigId) WHERE status = 'IN_PROGRESS' garantiza que dos
 * peticiones concurrentes (p. ej. el doble efecto de React StrictMode en
 * desarrollo) nunca crean dos intentos; la petición perdedora recibe el
 * intento creado por la ganadora.
 */
export async function createAttempt(
  userId: string,
  examConfigId: string
): Promise<{ attemptId: string; questions: SelectedQuestion[]; duration: number; passingScore: number }> {
  const config = await prisma.examConfig.findUnique({
    where: { id: examConfigId, isActive: true },
  });

  if (!config) {
    throw new Error("Configuración de examen no encontrada o inactiva");
  }

  // Fast path: si el usuario ya tiene un intento IN_PROGRESS para esta
  // configuración, se reanuda en lugar de crear uno nuevo.
  const existing = await findInProgressAttempt(userId, examConfigId);
  if (existing) {
    return resumeAttempt(existing, config);
  }

  const questions = await selectQuestions(
    config.categoryId,
    config.topicId,
    config.questionCount
  );

  // Intento + instantánea de preguntas en una transacción.
  // El índice único parcial (userId, examConfigId) WHERE status = 'IN_PROGRESS'
  // garantiza que dos peticiones concurrentes no creen dos intentos: la
  // perdedora de la carrera recibe el intento creado por la ganadora.
  let attempt: { id: string };
  try {
    attempt = await prisma.$transaction(async (tx) => {
      const created = await tx.examAttempt.create({
        data: {
          userId,
          examConfigId,
          status: "IN_PROGRESS",
          totalQuestions: config.questionCount,
        },
      });

      await tx.attemptAnswer.createMany({
        data: questions.map((q, i) => ({
          attemptId: created.id,
          questionId: q.id,
          order: i,
        })),
      });

      return created;
    });
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      // Una petición concurrente creó el intento primero: reanudarla.
      const winner = await findInProgressAttempt(userId, examConfigId);
      if (winner) {
        return resumeAttempt(winner, config);
      }
    }
    throw err;
  }

  return {
    attemptId: attempt.id,
    questions,
    duration: config.duration,
    passingScore: config.passingScore,
  };
}

/**
 * Guarda una respuesta durante el examen (sin calcular score).
 */
export async function saveAnswer(
  attemptId: string,
  questionId: string,
  selectedOptionId: string | null
): Promise<void> {
  // Check if answer already exists
  const existing = await prisma.attemptAnswer.findFirst({
    where: { attemptId, questionId },
  });

  if (existing) {
    await prisma.attemptAnswer.update({
      where: { id: existing.id },
      data: { selectedOptionId },
    });
  } else {
    await prisma.attemptAnswer.create({
      data: {
        attemptId,
        questionId,
        selectedOptionId,
      },
    });
  }
}

/**
 * Entrega el examen: valida tiempo, calcula score, guarda resultados.
 */
export async function submitAttempt(
  attemptId: string,
  userId: string
): Promise<{
  attemptId: string;
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  totalQuestions: number;
  passingScore: number;
}> {
  const attempt = await prisma.examAttempt.findUnique({
    where: { id: attemptId },
    include: { examConfig: true },
  });

  if (!attempt || attempt.userId !== userId) {
    throw new Error("Intento no encontrado");
  }

  if (attempt.status !== "IN_PROGRESS") {
    throw new Error("El examen ya ha sido entregado");
  }

  // Calculate score server-side
  const scoreInfo = await calculateScore(attemptId);

  // Update attempt
  await prisma.examAttempt.update({
    where: { id: attemptId },
    data: {
      status: "SUBMITTED",
      endTime: new Date(),
      score: scoreInfo.score,
      correctAnswers: scoreInfo.correct,
      incorrectAnswers: scoreInfo.incorrect,
      unanswered: scoreInfo.unanswered,
    },
  });

  return {
    attemptId,
    score: scoreInfo.score,
    correctAnswers: scoreInfo.correct,
    incorrectAnswers: scoreInfo.incorrect,
    unanswered: scoreInfo.unanswered,
    totalQuestions: attempt.totalQuestions || 0,
    passingScore: attempt.examConfig?.passingScore ?? 0,
  };
}

/**
 * Obtiene un intento con todas las respuestas y detalles de preguntas.
 */
export async function getAttempt(attemptId: string, userId: string) {
  const attempt = await prisma.examAttempt.findUnique({
    where: { id: attemptId },
    include: {
      answers: {
        include: {
          question: {
            include: {
              options: { orderBy: { order: "asc" } },
              topic: { select: { name: true } },
              category: { select: { name: true } },
            },
          },
        },
      },
      examConfig: { select: { name: true, passingScore: true } },
    },
  });

  if (!attempt || attempt.userId !== userId) {
    throw new Error("Intento no encontrado");
  }

  return attempt;
}
