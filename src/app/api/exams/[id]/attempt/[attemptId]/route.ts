import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";

// GET /api/exams/[id]/attempt/[attemptId] - Get attempt results
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; attemptId: string }> }
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
    const { attemptId } = await params;

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

    if (!attempt || attempt.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: "Intento no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: attempt });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al obtener resultados" },
      { status: 500 }
    );
  }
}
