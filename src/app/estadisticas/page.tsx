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

interface CategoryPerf {
  categoryId: string;
  categoryName: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
}

interface TopicPerf {
  topicId: string;
  topicName: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
}

export default function StatsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [catPerf, setCatPerf] = useState<CategoryPerf[]>([]);
  const [topicPerf, setTopicPerf] = useState<TopicPerf[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status !== "authenticated") return;

    async function loadStats() {
      try {
        const [statsRes, catRes, topicRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/stats/categories"),
          fetch("/api/stats/topics"),
        ]);

        if (statsRes.ok) {
          const data = await statsRes.json();
          if (data.success) setStats(data.data);
        }

        if (catRes.ok) {
          const data = await catRes.json();
          if (data.success) setCatPerf(data.data);
        }

        if (topicRes.ok) {
          const data = await topicRes.json();
          if (data.success) setTopicPerf(data.data);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [status, router]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">📊 Estadísticas</h1>

      {/* Overview cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-orange-500">{stats?.totalAttempts ?? 0}</p>
            <p className="text-sm text-slate-400 mt-1">Pruebas</p>
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
            <p className="text-sm text-slate-400 mt-1">Media</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-orange-500">{stats?.globalAccuracy ?? 0}%</p>
            <p className="text-sm text-slate-400 mt-1">Aciertos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance by category */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="text-lg">Por categoría</CardTitle>
            <CardDescription className="text-slate-400">Rendimiento por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            {catPerf.length > 0 ? (
              <div className="space-y-3">
                {catPerf.map((cat) => (
                  <div key={cat.categoryId} className="flex items-center justify-between p-3 rounded-lg bg-slate-800">
                    <div>
                      <p className="text-sm font-medium text-slate-200">{cat.categoryName}</p>
                      <p className="text-xs text-slate-500">{cat.correctAnswers}/{cat.totalQuestions} correctas</p>
                    </div>
                    <Badge variant="outline" className={cat.accuracy >= 50 ? "text-green-400 border-green-600" : "text-red-400 border-red-600"}>
                      {cat.accuracy.toFixed(1)}%
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <Alert className="bg-slate-800 border-slate-700">
                <AlertDescription className="text-slate-400">
                  Necesitas al menos una prueba completada para ver estadísticas por categoría.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Performance by topic */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="text-lg">Por tema</CardTitle>
            <CardDescription className="text-slate-400">Rendimiento por tema</CardDescription>
          </CardHeader>
          <CardContent>
            {topicPerf.length > 0 ? (
              <div className="space-y-3">
                {topicPerf.map((topic) => (
                  <div key={topic.topicId} className="flex items-center justify-between p-3 rounded-lg bg-slate-800">
                    <div>
                      <p className="text-sm font-medium text-slate-200">{topic.topicName}</p>
                      <p className="text-xs text-slate-500">{topic.correctAnswers}/{topic.totalQuestions} correctas</p>
                    </div>
                    <Badge variant="outline" className={topic.accuracy >= 50 ? "text-green-400 border-green-600" : "text-red-400 border-red-600"}>
                      {topic.accuracy.toFixed(1)}%
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <Alert className="bg-slate-800 border-slate-700">
                <AlertDescription className="text-slate-400">
                  Necesitas al menos un simulacro completado para ver estadísticas por tema.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent attempts */}
      {stats?.recentAttempts && stats.recentAttempts.length > 0 && (
        <Card className="mt-8 bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="text-lg">Últimos intentos</CardTitle>
            <CardDescription className="text-slate-400">Evolución de tus resultados</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
          <Link href="/dashboard">Volver al dashboard</Link>
        </Button>
        <Button asChild className="bg-orange-500 hover:bg-orange-600">
          <Link href="/simulacros">Nuevo simulacro</Link>
        </Button>
      </div>
    </div>
  );
}
