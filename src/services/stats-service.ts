import { prisma } from "@/lib/prisma";
import { isAttemptPassed } from "@/services/exam-service";

export interface UserStats {
  totalAttempts: number;
  passedAttempts: number;
  avgScore: number;
  globalAccuracy: number;
  recentAttempts: Array<{
    id: string;
    score: number | null;
    correctAnswers: number | null;
    totalQuestions: number | null;
    passingScore: number;
    passed: boolean;
    createdAt: Date;
    examConfig: { name: string | null; passingScore?: number } | null;
  }>;
  favoritesCount: number;
}

export interface AdminStats {
  totalUsers: number;
  totalQuestions: number;
  totalCategories: number;
  totalAttempts: number;
  approvalRate: number;
}

export interface CategoryPerformance {
  categoryId: string;
  categoryName: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
}

export interface TopicPerformance {
  topicId: string;
  topicName: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
}

/**
 * Estadísticas del usuario.
 */
export async function getUserStats(userId: string): Promise<UserStats> {
  const submittedAttempts = await prisma.examAttempt.findMany({
    where: { userId, status: "SUBMITTED" },
    select: {
      score: true,
      correctAnswers: true,
      totalQuestions: true,
      examConfig: { select: { passingScore: true } },
    },
  });

  const recentAttempts = await prisma.examAttempt.findMany({
    where: { userId, status: "SUBMITTED" },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      score: true,
      correctAnswers: true,
      totalQuestions: true,
      createdAt: true,
      examConfig: { select: { name: true, passingScore: true } },
    },
  });

  const formattedRecent = recentAttempts.map((a) => ({
    ...a,
    passingScore: a.examConfig?.passingScore ?? 0.5,
    passed: isAttemptPassed(a.score, a.examConfig?.passingScore),
  }));

  const totalAttempts = submittedAttempts.length;
  const passedAttempts = submittedAttempts.filter((a) =>
    isAttemptPassed(a.score, a.examConfig?.passingScore)
  ).length;

  const avgScore =
    totalAttempts > 0
      ? submittedAttempts.reduce(
          (sum, a) => sum + (a.score ?? 0),
          0
        ) / totalAttempts
      : 0;

  const totalCorrect = submittedAttempts.reduce(
    (sum, a) => sum + (a.correctAnswers ?? 0),
    0
  );
  const totalQuestions = submittedAttempts.reduce(
    (sum, a) => sum + (a.totalQuestions ?? 0),
    0
  );
  const globalAccuracy =
    totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

  const favoritesCount = await prisma.favorite.count({
    where: { userId },
  });

  return {
    totalAttempts,
    passedAttempts,
    avgScore: Math.round(avgScore * 100) / 100,
    globalAccuracy: Math.round(globalAccuracy * 100) / 100,
    recentAttempts: formattedRecent,
    favoritesCount,
  };
}

/**
 * Estadísticas globales para admin.
 */
export async function getAdminStats(): Promise<AdminStats> {
  const totalUsers = await prisma.user.count();
  const totalQuestions = await prisma.question.count();
  const totalCategories = await prisma.category.count();
  const totalAttempts = await prisma.examAttempt.count({
    where: { status: "SUBMITTED" },
  });

  const submittedAttempts = await prisma.examAttempt.findMany({
    where: { status: "SUBMITTED" },
    select: {
      score: true,
      examConfig: { select: { passingScore: true } },
    },
  });

  const passed = submittedAttempts.filter((a) =>
    isAttemptPassed(a.score, a.examConfig?.passingScore)
  ).length;
  const approvalRate =
    totalAttempts > 0 ? (passed / totalAttempts) * 100 : 0;

  return {
    totalUsers,
    totalQuestions,
    totalCategories,
    totalAttempts,
    approvalRate: Math.round(approvalRate * 100) / 100,
  };
}

/**
 * Últimos intentos del usuario.
 */
export async function getRecentAttempts(userId: string, limit = 10) {
  return prisma.examAttempt.findMany({
    where: { userId, status: "SUBMITTED" },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      examConfig: { select: { name: true } },
    },
  });
}

/**
 * Rendimiento por categoría.
 */
export async function getCategoryPerformance(userId: string): Promise<CategoryPerformance[]> {
  const attempts = await prisma.examAttempt.findMany({
    where: { userId, status: "SUBMITTED" },
    include: {
      answers: {
        include: {
          question: { select: { categoryId: true } },
        },
      },
    },
  });

  const categoryMap = new Map<string, { total: number; correct: number }>();

  for (const attempt of attempts) {
    for (const answer of attempt.answers) {
      if (!answer.question.categoryId) continue;

      const cat = categoryMap.get(answer.question.categoryId) || {
        total: 0,
        correct: 0,
      };
      cat.total++;
      if (answer.isCorrect) cat.correct++;
      categoryMap.set(answer.question.categoryId, cat);
    }
  }

  const results: CategoryPerformance[] = [];
  for (const [categoryId, data] of categoryMap) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { name: true },
    });

    results.push({
      categoryId,
      categoryName: category?.name || "Desconocida",
      totalQuestions: data.total,
      correctAnswers: data.correct,
      accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100 * 100) / 100 : 0,
    });
  }

  return results;
}

/**
 * Rendimiento por tema.
 */
export async function getTopicPerformance(userId: string): Promise<TopicPerformance[]> {
  const attempts = await prisma.examAttempt.findMany({
    where: { userId, status: "SUBMITTED" },
    include: {
      answers: {
        include: {
          question: { select: { topicId: true } },
        },
      },
    },
  });

  const topicMap = new Map<string, { total: number; correct: number }>();

  for (const attempt of attempts) {
    for (const answer of attempt.answers) {
      if (!answer.question.topicId) continue;

      const topic = topicMap.get(answer.question.topicId) || {
        total: 0,
        correct: 0,
      };
      topic.total++;
      if (answer.isCorrect) topic.correct++;
      topicMap.set(answer.question.topicId, topic);
    }
  }

  const results: TopicPerformance[] = [];
  for (const [topicId, data] of topicMap) {
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      select: { name: true },
    });

    results.push({
      topicId,
      topicName: topic?.name || "Desconocido",
      totalQuestions: data.total,
      correctAnswers: data.correct,
      accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100 * 100) / 100 : 0,
    });
  }

  return results;
}

/**
 * Preguntas favoritas del usuario.
 */
export async function getFavorites(userId: string) {
  return prisma.favorite.findMany({
    where: { userId },
    include: {
      question: {
        include: {
          options: { orderBy: { order: "asc" } },
          topic: { select: { name: true } },
          category: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Añade o quita favorito.
 */
export async function toggleFavorite(
  userId: string,
  questionId: string
): Promise<{ isFavorite: boolean }> {
  const existing = await prisma.favorite.findUnique({
    where: {
      userId_questionId: { userId, questionId },
    },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return { isFavorite: false };
  }

  await prisma.favorite.create({
    data: { userId, questionId },
  });

  return { isFavorite: true };
}
