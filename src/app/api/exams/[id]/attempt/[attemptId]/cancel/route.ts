import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions, type CustomUser } from "@/lib/auth";

// DELETE /api/exams/[id]/attempt/[attemptId] - Cancel exam attempt (user only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; attemptId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "No autenticado" },
      { status: 401 }
    );
  }

  const userId = (session.user as CustomUser).id;

  try {
    const { attemptId } = await params;

    const attempt = await prisma.examAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      return NextResponse.json(
        { success: false, error: "Intento no encontrado" },
        { status: 404 }
      );
    }

    if (attempt.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 403 }
      );
    }

    // Only allow cancellation of IN_PROGRESS attempts
    if (attempt.status !== "IN_PROGRESS") {
      return NextResponse.json(
        { success: false, error: "El intento ya ha sido entregado" },
        { status: 400 }
      );
    }

    // Delete attempt answers and the attempt itself
    await prisma.attemptAnswer.deleteMany({
      where: { attemptId },
    });
    await prisma.examAttempt.delete({
      where: { id: attemptId },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al cancelar el examen" },
      { status: 500 }
    );
  }
}
