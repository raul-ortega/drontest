import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";

// GET /api/favorites - Get user's favorites
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "No autenticado" },
      { status: 401 }
    );
  }

  const user = session.user;

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: {
        question: {
          include: {
            options: { orderBy: { order: "asc" } },
            topic: { select: { name: true } },
            category: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: favorites });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al obtener favoritos" },
      { status: 500 }
    );
  }
}

// POST /api/favorites - Toggle favorite
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "No autenticado" },
      { status: 401 }
    );
  }

  const user = session.user;

  try {
    const body = await request.json();
    const { questionId } = body;

    if (!questionId) {
      return NextResponse.json(
        { success: false, error: "questionId es requerido" },
        { status: 400 }
      );
    }

    // Check if already favorite
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_questionId: {
          userId: user.id,
          questionId,
        },
      },
    });

    if (existing) {
      // Remove favorite
      await prisma.favorite.delete({ where: { id: existing.id } });
      return NextResponse.json({ success: true, data: { isFavorite: false } });
    }

    // Add favorite
    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        questionId,
      },
    });

    return NextResponse.json({ success: true, data: { isFavorite: true } });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al gestionar favorito" },
      { status: 500 }
    );
  }
}
