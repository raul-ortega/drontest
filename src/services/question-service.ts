import { prisma } from "@/lib/prisma";
import type { QuestionStatus, Difficulty } from "@prisma/client";

export interface QuestionFilters {
  categoryId?: string;
  topicId?: string;
  status?: QuestionStatus;
  difficulty?: Difficulty;
  search?: string;
}

export async function getPublishedQuestions(filters: QuestionFilters = {}) {
  const where: Record<string, unknown> = { status: "PUBLISHED" };

  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.topicId) where.topicId = filters.topicId;
  if (filters.difficulty) where.difficulty = filters.difficulty;
  if (filters.search) {
    where.text = { contains: filters.search, mode: "insensitive" };
  }

  return prisma.question.findMany({
    where,
    include: {
      topic: { select: { id: true, name: true } },
      category: { select: { id: true, name: true } },
      options: { orderBy: { order: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getQuestionById(id: string) {
  return prisma.question.findUnique({
    where: { id },
    include: {
      topic: true,
      category: true,
      options: { orderBy: { order: "asc" } },
    },
  });
}

export async function createQuestion(data: {
  text: string;
  topicId: string;
  categoryId: string;
  difficulty?: Difficulty;
  explanation?: string | null;
  reference?: string | null;
  source?: string | null;
  status?: QuestionStatus;
  options: Array<{ text: string; isCorrect: boolean; order: number }>;
}) {
  return prisma.question.create({
    data: {
      ...data,
      options: { create: data.options },
    },
    include: { options: true },
  });
}

export async function updateQuestion(
  id: string,
  data: {
    text?: string;
    topicId?: string;
    categoryId?: string;
    difficulty?: Difficulty;
    explanation?: string | null;
    reference?: string | null;
    source?: string | null;
    status?: QuestionStatus;
    options?: Array<{ text: string; isCorrect: boolean; order: number }>;
  }
) {
  const question = await prisma.question.update({
    where: { id },
    data: {
      text: data.text,
      topicId: data.topicId,
      categoryId: data.categoryId,
      difficulty: data.difficulty,
      explanation: data.explanation,
      reference: data.reference,
      source: data.source,
      status: data.status,
    },
    include: { options: true },
  });

  // Update options if provided
  if (data.options) {
    await prisma.answerOption.deleteMany({ where: { questionId: id } });
    await prisma.answerOption.createMany({
      data: data.options.map((opt) => ({
        questionId: id,
        text: opt.text,
        isCorrect: opt.isCorrect,
        order: opt.order,
      })),
    });
  }

  return prisma.question.findUnique({
    where: { id },
    include: { options: { orderBy: { order: "asc" } } },
  });
}

export async function deleteQuestion(id: string) {
  await prisma.question.delete({ where: { id } });
}

export async function getQuestionsByCategory(categoryId: string) {
  return prisma.question.findMany({
    where: { categoryId, status: "PUBLISHED" },
    include: {
      topic: { select: { name: true } },
      options: { orderBy: { order: "asc" } },
    },
  });
}

export async function getQuestionsByTopic(topicId: string) {
  return prisma.question.findMany({
    where: { topicId, status: "PUBLISHED" },
    include: {
      category: { select: { name: true } },
      options: { orderBy: { order: "asc" } },
    },
  });
}

export async function importQuestions(
  questions: Array<{
    text: string;
    topicId: string;
    categoryId: string;
    difficulty?: Difficulty;
    explanation?: string | null;
    reference?: string | null;
    source?: string | null;
    status?: QuestionStatus;
    options: Array<{ text: string; isCorrect: boolean; order: number }>;
  }>
): Promise<{ imported: number; errors: string[] }> {
  let imported = 0;
  const errors: string[] = [];

  for (const q of questions) {
    try {
      if (!q.text || !q.topicId || !q.categoryId || !q.options?.length) {
        errors.push(`Pregunta ${imported + 1}: campos obligatorios faltantes`);
        continue;
      }

      const hasCorrect = q.options.some((opt) => opt.isCorrect);
      if (!hasCorrect) {
        errors.push(`Pregunta ${imported + 1}: al menos una opción debe ser correcta`);
        continue;
      }

      await prisma.question.create({
        data: {
          ...q,
          options: { create: q.options },
        },
      });
      imported++;
    } catch (err) {
      errors.push(`Pregunta ${imported + 1}: ${err instanceof Error ? err.message : "error"}`);
    }
  }

  return { imported, errors };
}

export async function exportQuestions(filters: QuestionFilters = {}) {
  const where: Record<string, unknown> = {};
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.topicId) where.topicId = filters.topicId;
  if (filters.status) where.status = filters.status;

  const questions = await prisma.question.findMany({
    where,
    include: {
      options: { orderBy: { order: "asc" } },
      topic: { select: { id: true, name: true } },
      category: { select: { id: true, name: true } },
    },
  });

  return questions.map((q) => ({
    text: q.text,
    topicId: q.topicId,
    categoryId: q.categoryId,
    difficulty: q.difficulty,
    explanation: q.explanation,
    reference: q.reference,
    source: q.source,
    status: q.status,
    options: q.options.map((opt) => ({
      text: opt.text,
      isCorrect: opt.isCorrect,
      order: opt.order,
    })),
  }));
}
