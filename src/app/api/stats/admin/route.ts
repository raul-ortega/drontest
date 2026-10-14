import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/middleware";
import { getAdminStats } from "@/services/stats-service";

// GET /api/stats/admin - Get admin global statistics
export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin.authenticated) {
    return NextResponse.json(
      { success: false, error: admin.error },
      { status: 403 }
    );
  }

  try {
    const stats = await getAdminStats();
    return NextResponse.json({ success: true, data: stats });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al obtener estadísticas" },
      { status: 500 }
    );
  }
}
