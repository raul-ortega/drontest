import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";

// DELETE /api/favorites/[id] - Remove favorite
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "No autenticado" },
      { status: 401 }
    );
  }

  const user = session.user;

  try {
    const { id } = await params;
    const favorite = await prisma.favorite.findUnique({ where: { id } });

    if (!favorite || favorite.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: "Favorito no encontrado" },
        { status: 404 }
      );
    }

    await prisma.favorite.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al eliminar favorito" },
      { status: 500 }
    );
  }
}
