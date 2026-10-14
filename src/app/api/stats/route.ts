import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/middleware";
import { getUserStats } from "@/services/stats-service";

// GET /api/stats - Get user statistics
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "No autenticado" },
      { status: 401 }
    );
  }

  try {
    const stats = await getUserStats(session.user.id);
    return NextResponse.json({ success: true, data: stats });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al obtener estadísticas" },
      { status: 500 }
    );
  }
}
