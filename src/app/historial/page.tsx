"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AttemptRow {
  id: string;
  score: number | null;
  correctAnswers: number | null;
  incorrectAnswers: number | null;
  unanswered: number | null;
  totalQuestions: number;
  passingScore: number;
  createdAt: string;
  examConfig: { name: string | null; passingScore?: number } | null;
}

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status !== "authenticated") return;

    async function loadAttempts() {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          if (data.success) setAttempts(data.data.recentAttempts);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }

    loadAttempts();
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
      <h1 className="text-2xl font-bold text-slate-100 mb-2">📋 Historial</h1>
      <p className="text-slate-400 mb-6">Todos tus intentos de prueba.</p>

      {attempts.length > 0 ? (
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-slate-800">
                  <TableHead className="text-slate-300">Prueba</TableHead>
                  <TableHead className="text-slate-300">Fecha</TableHead>
                  <TableHead className="text-slate-300">Aciertos</TableHead>
                  <TableHead className="text-slate-300 text-right">Puntuación</TableHead>
                  <TableHead className="text-slate-300 text-right">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attempts.map((attempt) => {
                  const passed = (attempt.score ?? 0) >= (attempt.examConfig?.passingScore ?? 50);
                  return (
                    <TableRow
                      key={attempt.id}
                      className="border-slate-800 hover:bg-slate-800 cursor-pointer"
                    >
                      <TableCell
                        className="font-medium text-slate-200"
                      >
                        <Link href={`/resultados/${attempt.id}`} className="hover:text-orange-500">
                          {attempt.examConfig?.name || "Simulacro"}
                        </Link>
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {new Date(attempt.createdAt).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {attempt.correctAnswers}/{attempt.totalQuestions}
                      </TableCell>
                      <TableCell className="text-right font-bold text-orange-500">
                        {attempt.score?.toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={passed ? "default" : "secondary"} className={passed ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
                          {passed ? "Aprobado" : "No aprobado"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Alert className="bg-slate-800 border-slate-700">
          <AlertDescription className="text-slate-400">
            Aún no has realizado ninguna prueba.
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
          <Link href="/dashboard">Volver al dashboard</Link>
        </Button>
        <Button asChild className="bg-orange-500 hover:bg-orange-600">
          <Link href="/simulacros">Hacer una prueba</Link>
        </Button>
      </div>
    </div>
  );
}
