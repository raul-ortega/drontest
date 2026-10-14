"use client";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/session-provider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StatsData {
  totalAttempts: number;
  passedAttempts: number;
  avgScore: number;
  globalAccuracy: number;
  recentAttempts: Array<{
    id: string;
    score: number | null;
    correctAnswers: number | null;
    totalQuestions: number | null;
    passingScore: number | null;
    passed: boolean;
    createdAt: string;
    examConfig: { name: string | null } | null;
  }>;
  favoritesCount: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; topics: Array<{ id: string; name: string }>; _count: { questions: number } }>>([]);
  const [examConfigs, setExamConfigs] = useState<Array<{ id: string; name: string; description?: string | null; questionCount: number; duration: number; passingScore: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status !== "authenticated") return;

    async function loadData() {
      try {
        const [statsRes, catsRes, examsRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/categories"),
          fetch("/api/exams"),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData.success) setStats(statsData.data);
        }

        if (catsRes.ok) {
          const catsData = await catsRes.json();
          if (catsData.success) setCategories(catsData.data);
        }

        if (examsRes.ok) {
          const examsData = await examsRes.json();
          if (examsData.success) setExamConfigs(examsData.data);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [status, router]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">
        Bienvenido, {session?.user?.name || session?.user?.email}
      </h1>

      {/* Stats summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-orange-500">{stats?.totalAttempts ?? 0}</p>
            <p className="text-sm text-slate-400 mt-1">Pruebas realizadas</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-green-500">{stats?.passedAttempts ?? 0}</p>
            <p className="text-sm text-slate-400 mt-1">Aprobados</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-orange-500">{stats?.avgScore?.toFixed(1) ?? 0}%</p>
            <p className="text-sm text-slate-400 mt-1">Puntuación media</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-orange-500">{stats?.globalAccuracy ?? 0}%</p>
            <p className="text-sm text-slate-400 mt-1">Aciertos globales</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick actions */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-100">Acciones rápidas</h2>

          {/* Simulacros */}
          <Card className="bg-slate-900 border-slate-800 text-slate-100">
            <CardHeader>
              <CardTitle className="text-lg">⏱️ Simulacros</CardTitle>
              <CardDescription className="text-slate-400">Simulacros de examen con distribución proporcional</CardDescription>
            </CardHeader>
            <CardContent>
              {examConfigs.length > 0 ? (
                <div className="space-y-2">
                  {examConfigs.map((exam) => (
                    <Link key={exam.id} href={`/simulacros/${exam.id}`}>
                      <Button variant="outline" className="w-full justify-between border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                        <span>{exam.name}</span>
                        <Badge variant="secondary" className="bg-slate-800 text-slate-400">
                          {exam.questionCount} preguntas
                        </Badge>
                      </Button>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No hay simulacros disponibles</p>
              )}
            </CardContent>
          </Card>

          {/* Simulacros */}
          <Card className="bg-slate-900 border-slate-800 text-slate-100">
            <CardHeader>
              <CardTitle className="text-lg">⏱️ Pruebas</CardTitle>
              <CardDescription className="text-slate-400">Exámenes cronometrados</CardDescription>
            </CardHeader>
            <CardContent>
              {examConfigs.length > 0 ? (
                <div className="space-y-2">
                  {examConfigs.map((exam) => (
                    <Link key={exam.id} href={`/simulacros/${exam.id}`}>
                      <Button variant="outline" className="w-full justify-between border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                        <span>{exam.name}</span>
                        <span className="text-xs text-slate-500">{exam.questionCount} preguntas · {Math.floor(exam.duration / 60)}m</span>
                      </Button>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No hay pruebas disponibles</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent attempts */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-100">Últimos intentos</h2>

          <Card className="bg-slate-900 border-slate-800 text-slate-100">
            <CardContent className="pt-6">
              {stats?.recentAttempts && stats.recentAttempts.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentAttempts.map((attempt) => {
                    const passed = attempt.passed;
                    return (
                      <Link key={attempt.id} href={`/resultados/${attempt.id}`}>
                        <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer">
                          <div>
                            <p className="text-sm font-medium text-slate-200">
                              {attempt.examConfig?.name || "Simulacro"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {new Date(attempt.createdAt).toLocaleDateString("es-ES")}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={passed ? "default" : "secondary"} className={passed ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
                              {passed ? "Aprobado" : "No aprobado"}
                            </Badge>
                            <span className="text-sm font-bold text-orange-500">
                              {attempt.score?.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <Alert className="bg-slate-800 border-slate-700">
                  <AlertDescription className="text-slate-400">
                    Aún no has realizado ninguna prueba. ¡Empieza a practicar!
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Links */}
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              <Link href="/favoritos">⭐ Favoritos ({stats?.favoritesCount ?? 0})</Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              <Link href="/historial">📋 Historial</Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              <Link href="/estadisticas">📊 Estadísticas</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
