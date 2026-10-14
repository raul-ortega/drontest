import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/middleware";
import { UpdateQuestionSchema as updateQuestionSchema } from "@/lib/validations";

// GET /api/questions/[id] - Get single question
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        topic: true,
        category: true,
        options: { orderBy: { order: "asc" } },
      },
    });

    if (!question) {
      return NextResponse.json(
        { success: false, error: "Pregunta no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: question });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al obtener la pregunta" },
      { status: 500 }
    );
  }
}

// PUT /api/questions/[id] - Update question (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin.authenticated) {
    return NextResponse.json(
      { success: false, error: admin.error },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateQuestionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0].message },
        { status: 400 }
      );
    }

    const { text, topicId, categoryId, difficulty, explanation, reference, source, status, options } =
      validated.data;

    const question = await prisma.question.update({
      where: { id },
      data: {
        text,
        topicId,
        categoryId,
        difficulty,
        explanation,
        reference,
        source,
        status,
      },
      include: {
        options: true,
      },
    });

    // Update options if provided
    if (options) {
      // Delete existing options
      await prisma.answerOption.deleteMany({
        where: { questionId: id },
      });

      // Create new options
      await prisma.answerOption.createMany({
        data: options.map((opt) => ({
          questionId: id,
          text: opt.text,
          isCorrect: opt.isCorrect,
          order: opt.order,
        })),
      });
    }

    return NextResponse.json({ success: true, data: question });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al actualizar la pregunta" },
      { status: 500 }
    );
  }
}

// DELETE /api/questions/[id] - Delete question (admin only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin.authenticated) {
    return NextResponse.json(
      { success: false, error: admin.error },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;
    await prisma.question.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al eliminar la pregunta" },
      { status: 500 }
    );
  }
}
