import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/middleware";
import { CreateTopicSchema as createTopicSchema } from "@/lib/validations";

// GET /api/topics - List topics with optional category filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const where: Record<string, unknown> = {};
    if (categoryId) where.categoryId = categoryId;

    const topics = await prisma.topic.findMany({
      where,
      include: {
        category: { select: { name: true } },
        _count: { select: { questions: true } },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, data: topics });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al obtener temas" },
      { status: 500 }
    );
  }
}

// POST /api/topics - Create topic (admin only)
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
    const validated = createTopicSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0].message },
        { status: 400 }
      );
    }

    const topic = await prisma.topic.create({
      data: validated.data,
    });

    return NextResponse.json({ success: true, data: topic });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al crear el tema" },
      { status: 500 }
    );
  }
}
