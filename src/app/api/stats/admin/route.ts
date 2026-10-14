import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/middleware";

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
    const totalUsers = await prisma.user.count();
    const totalQuestions = await prisma.question.count();
    const totalCategories = await prisma.category.count();
    const totalAttempts = await prisma.examAttempt.count({
      where: { status: "SUBMITTED" },
    });

    const submittedAttempts = await prisma.examAttempt.findMany({
      where: { status: "SUBMITTED" },
      select: { score: true },
    });

    const passed = submittedAttempts.filter((a) => (a.score ?? 0) >= 50).length;
    const approvalRate =
      totalAttempts > 0 ? (passed / totalAttempts) * 100 : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalQuestions,
        totalCategories,
        totalAttempts,
        approvalRate: Math.round(approvalRate * 100) / 100,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al obtener estadísticas" },
      { status: 500 }
    );
  }
}
