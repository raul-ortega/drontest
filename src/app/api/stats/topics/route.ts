import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, CustomUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/stats/topics - Get topic performance
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
            question: { select: { topicId: true } },
          },
        },
      },
    });

    const topicMap = new Map<string, { total: number; correct: number }>();

    for (const attempt of attempts) {
      for (const answer of attempt.answers) {
        if (!answer.question.topicId) continue;

        const topic = topicMap.get(answer.question.topicId) || { total: 0, correct: 0 };
        topic.total++;
        if (answer.isCorrect) topic.correct++;
        topicMap.set(answer.question.topicId, topic);
      }
    }

    const results = [];
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

    return NextResponse.json({ success: true, data: results });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al obtener estadísticas por tema" },
      { status: 500 }
    );
  }
}
