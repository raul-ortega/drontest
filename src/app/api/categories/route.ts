import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/middleware";
import { CreateCategorySchema as createCategorySchema } from "@/lib/validations";

// GET /api/categories - List all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        topics: { select: { id: true, name: true } },
        _count: { select: { questions: true } },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al obtener categorías" },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create category (admin only)
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
    const validated = createCategorySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0].message },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: validated.data,
    });

    return NextResponse.json({ success: true, data: category });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al crear la categoría" },
      { status: 500 }
    );
  }
}
