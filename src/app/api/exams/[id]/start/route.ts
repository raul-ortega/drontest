import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/middleware";
import { createAttempt } from "@/services/exam-service";

// POST /api/exams/[id]/start - Start a new exam attempt
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "No autenticado" },
      { status: 401 }
    );
  }

  const user = session.user;

  try {
    const { id } = await params;
    const result = await createAttempt(user.id, id);

    // Mientras el examen está activo NO se envían las respuestas correctas
    // ni las explicaciones al cliente.
    const questions = result.questions.map((q) => ({
      id: q.id,
      text: q.text,
      difficulty: q.difficulty,
      topicId: q.topicId,
      categoryId: q.categoryId,
      options: q.options.map(({ id: optionId, text, order }) => ({
        id: optionId,
        text,
        order,
      })),
    }));

    return NextResponse.json({
      success: true,
      data: {
        attemptId: result.attemptId,
        questions,
        duration: result.duration,
        passingScore: result.passingScore,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al iniciar el examen";

    let status = 500;
    if (message.startsWith("Solo hay")) {
      status = 400;
    } else if (message.startsWith("Configuración de examen")) {
      status = 404;
    } else if (message.startsWith("El tiempo del examen")) {
      status = 400;
    }

    return NextResponse.json({ success: false, error: message }, { status });
  }
}
