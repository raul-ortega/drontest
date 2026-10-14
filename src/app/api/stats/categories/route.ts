import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, CustomUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/stats/categories - Get category performance
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "No autenticado" },
      { status: 401 }
    );
  }

  const user = session.user as CustomUser;

  try {
    const attempts = await prisma.examAttempt.findMany({
      where: { userId: user.id, status: "SUBMITTED" },
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

        const cat = categoryMap.get(answer.question.categoryId) || { total: 0, correct: 0 };
        cat.total++;
        if (answer.isCorrect) cat.correct++;
        categoryMap.set(answer.question.categoryId, cat);
      }
    }

    const results = [];
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

    return NextResponse.json({ success: true, data: results });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al obtener estadísticas por categoría" },
      { status: 500 }
    );
  }
}
