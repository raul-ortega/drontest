import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/middleware";
import { UpdateCategorySchema as updateCategorySchema } from "@/lib/validations";

// GET /api/categories/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        topics: { orderBy: { order: "asc" } },
        questions: { select: { id: true } },
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: category });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al obtener la categoría" },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Update (admin only)
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
    const validated = updateCategorySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0].message },
        { status: 400 }
      );
    }

    const category = await prisma.category.update({
      where: { id },
      data: validated.data,
    });

    return NextResponse.json({ success: true, data: category });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al actualizar la categoría" },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete (admin only)
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
    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al eliminar la categoría" },
      { status: 500 }
    );
  }
}
