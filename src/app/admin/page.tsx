"use client";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/session-provider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
interface AdminStats {
  totalUsers: number;
  totalQuestions: number;
  totalCategories: number;
  totalAttempts: number;
  approvalRate: number;
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status !== "authenticated") return;
    if (session?.user?.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }

    async function loadStats() {
      try {
        const res = await fetch("/api/stats/admin");
        if (res.ok) {
          const data = await res.json();
          if (data.success) setStats(data.data);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [status, router, session]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Panel de Administración</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-orange-500">{stats?.totalUsers ?? 0}</p>
            <p className="text-sm text-slate-400 mt-1">Usuarios</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-orange-500">{stats?.totalQuestions ?? 0}</p>
            <p className="text-sm text-slate-400 mt-1">Preguntas</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-orange-500">{stats?.totalCategories ?? 0}</p>
            <p className="text-sm text-slate-400 mt-1">Categorías</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-orange-500">{stats?.totalAttempts ?? 0}</p>
            <p className="text-sm text-slate-400 mt-1">Simulacros</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-green-500">{stats?.approvalRate?.toFixed(1) ?? 0}%</p>
            <p className="text-sm text-slate-400 mt-1">Aprobación</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <h2 className="text-xl font-semibold text-slate-100 mb-4">Gestión rápida</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="text-lg">📁 Categorías</CardTitle>
            <CardDescription className="text-slate-400">Gestionar categorías y temas</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              <Link href="/admin/categorias">Gestionar</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="text-lg">❓ Preguntas</CardTitle>
            <CardDescription className="text-slate-400">Gestionar banco de preguntas</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              <Link href="/admin/preguntas">Gestionar</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="text-lg">⏱️ Simulacros</CardTitle>
            <CardDescription className="text-slate-400">Configurar tipos de examen</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              <Link href="/admin/simulacros">Gestionar</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="text-lg">📊 Estadísticas</CardTitle>
            <CardDescription className="text-slate-400">Ver estadísticas globales</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              <Link href="/estadisticas">Ver estadísticas</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
