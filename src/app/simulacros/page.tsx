"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ExamConfig {
  id: string;
  name: string;
  description: string | null;
  questionCount: number;
  duration: number;
  passingScore: number;
}

export default function SimulacrosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [exams, setExams] = useState<ExamConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status !== "authenticated") return;

    async function loadExams() {
      try {
        const res = await fetch("/api/exams");
        if (res.ok) {
          const data = await res.json();
          if (data.success) setExams(data.data);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }

    loadExams();
  }, [status, router]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-100 mb-2">⏱️ Simulacros de examen</h1>
      <p className="text-slate-400 mb-6">Selecciona una prueba para empezar. Tendrás un tiempo límite.</p>

      {exams.length > 0 ? (
        <div className="space-y-4">
          {exams.map((exam) => (
            <Card key={exam.id} className="bg-slate-900 border-slate-800 text-slate-100">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{exam.name}</span>
                  <Badge variant="outline" className="bg-slate-800 text-slate-400">
                    Nota mínima: {(exam.passingScore * 100).toFixed(0)}%
                  </Badge>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {exam.description || "Sin descripción"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4 text-sm text-slate-400">
                  <span>📝 {exam.questionCount} preguntas</span>
                  <span>⏱️ {Math.floor(exam.duration / 60)} minutos</span>
                </div>
                <Button
                  asChild
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Link href={`/simulacros/${exam.id}`}>Empezar</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Alert className="bg-slate-800 border-slate-700">
          <AlertDescription className="text-slate-400">
            No hay pruebas disponibles actualmente.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
