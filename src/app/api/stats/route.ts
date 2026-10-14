import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, CustomUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/stats - Get user statistics
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "No autenticado" },
      { status: 401 }
    );
  }

  const user = session.user as CustomUser;
  const userId = user.id;

  try {
    // Total attempts
    const totalAttempts = await prisma.examAttempt.count({
      where: { userId, status: "SUBMITTED" },
    });

    // Submitted attempts with examConfig
    const submittedAttempts = await prisma.examAttempt.findMany({
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

    // Format recent attempts with passingScore from examConfig
    const recentAttempts = submittedAttempts.map((a) => ({
      ...a,
      passingScore: a.examConfig?.passingScore ?? 0.5,
    }));

    // Average score
    const allAttempts = await prisma.examAttempt.findMany({
      where: { userId, status: "SUBMITTED" },
      select: { score: true, correctAnswers: true, totalQuestions: true },
    });

    const avgScore = allAttempts.length > 0
      ? allAttempts.reduce((sum, a) => sum + (a.score ?? 0), 0) / allAttempts.length
      : 0;

    // Passed attempts
    const passedAttempts = allAttempts.filter((a) => (a.score ?? 0) >= 50).length;

    // Total correct answers across all attempts
    const totalCorrect = allAttempts.reduce((sum, a) => sum + (a.correctAnswers ?? 0), 0);
    const totalQuestionsAnswered = allAttempts.reduce((sum, a) => sum + (a.totalQuestions ?? 0), 0);
    const globalAccuracy = totalQuestionsAnswered > 0
      ? (totalCorrect / totalQuestionsAnswered) * 100
      : 0;

    // Favorites count
    const favoritesCount = await prisma.favorite.count({
      where: { userId },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalAttempts,
        passedAttempts,
        avgScore: Math.round(avgScore * 100) / 100,
        globalAccuracy: Math.round(globalAccuracy * 100) / 100,
        recentAttempts,
        favoritesCount,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al obtener estadísticas" },
      { status: 500 }
    );
  }
}
