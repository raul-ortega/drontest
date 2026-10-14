import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/middleware";

// GET /api/export - Export questions as JSON
export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin.authenticated) {
    return NextResponse.json(
      { success: false, error: admin.error },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const questions = await prisma.question.findMany({
      where,
      include: {
        options: { orderBy: { order: "asc" } },
        topic: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
      },
    });

    const exported = questions.map((q) => ({
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

    return NextResponse.json({ success: true, data: exported });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al exportar preguntas" },
      { status: 500 }
    );
  }
}
