import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/middleware";
import { CreateExamConfigSchema as createExamConfigSchema } from "@/lib/validations";

// GET /api/exams - List exam configs
export async function GET() {
  const session = await getSession();
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "No autenticado" },
      { status: 401 }
    );
  }

  try {
    const configs = await prisma.examConfig.findMany({
      where: { isActive: true },
      select: { id: true, name: true, description: true, questionCount: true, duration: true, passingScore: true, isActive: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: configs });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al obtener simulacros" },
      { status: 500 }
    );
  }
}

// POST /api/exams - Create exam config (admin only)
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
    const validated = createExamConfigSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0].message },
        { status: 400 }
      );
    }

    const config = await prisma.examConfig.create({
      data: { ...validated.data, categoryId: null, topicId: null },
    });

    return NextResponse.json({ success: true, data: config });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al crear el simulacro" },
      { status: 500 }
    );
  }
}
