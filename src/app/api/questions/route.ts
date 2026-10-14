import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/middleware";
import { CreateQuestionSchema as createQuestionSchema } from "@/lib/validations";

// GET /api/questions - List published questions with filters
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "No autenticado" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const topicId = searchParams.get("topicId");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    if (categoryId) where.categoryId = categoryId;
    if (topicId) where.topicId = topicId;
    if (status) where.status = status;
    if (search) {
      where.text = { contains: search, mode: "insensitive" };
    }

    const questions = await prisma.question.findMany({
      where,
      include: {
        topic: { select: { name: true } },
        category: { select: { name: true } },
        options: { select: { id: true, text: true, isCorrect: true, order: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: questions });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al obtener preguntas" },
      { status: 500 }
    );
  }
}

// POST /api/questions - Create question (admin only)
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
    const validated = createQuestionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0].message },
        { status: 400 }
      );
    }

    const { text, topicId, categoryId, difficulty, explanation, reference, source, options } =
      validated.data;

    const question = await prisma.question.create({
      data: {
        text,
        topicId,
        categoryId,
        difficulty,
        explanation,
        reference,
        source,
        status: "DRAFT",
        options: {
          create: options.map((opt) => ({
            text: opt.text,
            isCorrect: opt.isCorrect,
          })),
        },
      },
      include: {
        options: true,
      },
    });

    return NextResponse.json({ success: true, data: question });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al crear la pregunta" },
      { status: 500 }
    );
  }
}
