import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/middleware";
import { UpdateExamConfigSchema as updateExamConfigSchema } from "@/lib/validations";

// GET /api/exams/[id] - Get exam config
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const config = await prisma.examConfig.findUnique({
      where: { id },
      include: {
        category: { select: { name: true } },
        topic: { select: { name: true } },
      },
    });

    if (!config) {
      return NextResponse.json(
        { success: false, error: "Simulacro no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: config });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al obtener el simulacro" },
      { status: 500 }
    );
  }
}

// PUT /api/exams/[id] - Update (admin only)
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

    // Convert passingScore from percentage to decimal, force no category/topic filter
    if (body.passingScore !== undefined) {
      body.passingScore = body.passingScore / 100;
    }
    body.categoryId = null;
    body.topicId = null;

    const config = await prisma.examConfig.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, data: config });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al actualizar el simulacro" },
      { status: 500 }
    );
  }
}

// DELETE /api/exams/[id] - Delete (admin only)
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
    await prisma.examConfig.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al eliminar el simulacro" },
      { status: 500 }
    );
  }
}
