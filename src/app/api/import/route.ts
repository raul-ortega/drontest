import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/middleware";

// POST /api/import - Import questions from JSON
export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin.authenticated) {
    return NextResponse.json(
      { success: false, error: admin.error },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { questions } = body;

    if (!Array.isArray(questions)) {
      return NextResponse.json(
        { success: false, error: "Se espera un array de preguntas" },
        { status: 400 }
      );
    }

    let imported = 0;
    const errors: string[] = [];

    for (const q of questions) {
      try {
        // Validate required fields
        if (!q.text || !q.topicId || !q.categoryId || !q.options || !Array.isArray(q.options)) {
          errors.push(`Pregunta ${imported + 1}: campos obligatorios faltantes`);
          continue;
        }

        // Check at least one correct option
        const hasCorrect = q.options.some((opt: { isCorrect: boolean }) => opt.isCorrect);
        if (!hasCorrect) {
          errors.push(`Pregunta ${imported + 1}: al menos una opción debe ser correcta`);
          continue;
        }

        await prisma.question.create({
          data: {
            text: q.text,
            topicId: q.topicId,
            categoryId: q.categoryId,
            difficulty: q.difficulty || "MEDIUM",
            explanation: q.explanation || null,
            reference: q.reference || null,
            source: q.source || null,
            status: q.status || "DRAFT",
            options: {
              create: q.options.map((opt: { text: string; isCorrect: boolean; order?: number }) => ({
                text: opt.text,
                isCorrect: opt.isCorrect,
                order: opt.order ?? 0,
              })),
            },
          },
        });

        imported++;
      } catch (err) {
        errors.push(`Pregunta ${imported + 1}: ${err instanceof Error ? err.message : "error desconocido"}`);
      }
    }

    return NextResponse.json({
      success: true,
      data: { imported, errors },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al importar preguntas" },
      { status: 500 }
    );
  }
}
