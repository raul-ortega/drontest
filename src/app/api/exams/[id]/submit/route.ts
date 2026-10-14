import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, CustomUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ExamSubmissionSchema as examSubmissionSchema } from "@/lib/validations";

// POST /api/exams/[id]/submit - Submit exam and calculate score SERVER-SIDE
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "No autenticado" },
      { status: 401 }
    );
  }

  const user = session.user as CustomUser;

  try {
    const { id } = await params;
    const body = await request.json();
    const validated = examSubmissionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0].message },
        { status: 400 }
      );
    }

    const { attemptId, answers } = validated.data;

    // Verify attempt belongs to user and is in progress
    const attempt = await prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: { examConfig: true },
    });

    if (!attempt || attempt.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: "Intento no encontrado" },
        { status: 404 }
      );
    }

    if (attempt.status !== "IN_PROGRESS") {
      return NextResponse.json(
        { success: false, error: "El examen ya ha sido entregado" },
        { status: 400 }
      );
    }

    // Validación del tiempo en el servidor (con margen de 30s por latencia)
    const durationMs = (attempt.examConfig?.duration ?? 0) * 60 * 1000;
    const deadline = attempt.startTime.getTime() + durationMs + 30 * 1000;
    if (Date.now() > deadline) {
      await prisma.examAttempt.update({
        where: { id: attemptId },
        data: { status: "EXPIRED", endTime: new Date() },
      });
      return NextResponse.json(
        { success: false, error: "El tiempo del examen ha expirado" },
        { status: 400 }
      );
    }

    // Calculate score server-side using the correct answers from DB
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let unanswered = 0;

    // Delete any existing answers for this attempt
    await prisma.attemptAnswer.deleteMany({
      where: { attemptId },
    });

    // Process each answer
    for (const answer of answers) {
      if (!answer.selectedOptionId) {
        unanswered++;
        await prisma.attemptAnswer.create({
          data: {
            attemptId,
            questionId: answer.questionId,
            isCorrect: false,
          },
        });
        continue;
      }

      const selectedOption = await prisma.answerOption.findUnique({
        where: { id: answer.selectedOptionId },
      });

      if (!selectedOption) {
        unanswered++;
        await prisma.attemptAnswer.create({
          data: {
            attemptId,
            questionId: answer.questionId,
            isCorrect: false,
          },
        });
        continue;
      }

      const isCorrect = selectedOption.isCorrect;
      if (isCorrect) {
        correctAnswers++;
      } else {
        incorrectAnswers++;
      }

      await prisma.attemptAnswer.create({
        data: {
          attemptId,
          questionId: answer.questionId,
          selectedOptionId: answer.selectedOptionId,
          isCorrect,
        },
      });
    }

    const totalQuestions = attempt.totalQuestions ?? (correctAnswers + incorrectAnswers + unanswered);
    unanswered = totalQuestions - correctAnswers - incorrectAnswers;
    const score = totalQuestions > 0
      ? (correctAnswers / totalQuestions) * 100
      : 0;

    // Update attempt with results
    await prisma.examAttempt.update({
      where: { id: attemptId },
      data: {
        status: "SUBMITTED",
        endTime: new Date(),
        score,
        correctAnswers,
        incorrectAnswers,
        unanswered,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        attemptId,
        score,
        correctAnswers,
        incorrectAnswers,
        unanswered,
        totalQuestions,
        passingScore: attempt.examConfig?.passingScore ?? 0,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al entregar el examen" },
      { status: 500 }
    );
  }
}
