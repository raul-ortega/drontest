import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/middleware";
import { UpdateTopicSchema as updateTopicSchema } from "@/lib/validations";

// GET /api/topics/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const topic = await prisma.topic.findUnique({
      where: { id },
      include: {
        category: true,
        questions: { select: { id: true } },
      },
    });

    if (!topic) {
      return NextResponse.json(
        { success: false, error: "Tema no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: topic });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al obtener el tema" },
      { status: 500 }
    );
  }
}

// PUT /api/topics/[id] - Update (admin only)
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
    const validated = updateTopicSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0].message },
        { status: 400 }
      );
    }

    const topic = await prisma.topic.update({
      where: { id },
      data: validated.data,
    });

    return NextResponse.json({ success: true, data: topic });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al actualizar el tema" },
      { status: 500 }
    );
  }
}

// DELETE /api/topics/[id] - Delete (admin only)
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
    await prisma.topic.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al eliminar el tema" },
      { status: 500 }
    );
  }
}
