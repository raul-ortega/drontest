"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ExamResults } from "@/components/exam/exam-results";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AttemptAnswer {
  isCorrect: boolean;
  question: {
    id: string;
    text: string;
    options: Array<{ id: string; text: string; isCorrect: boolean; order: number }>;
    topic?: { name: string };
    category?: { name: string };
    explanation?: string | null;
  };
  selectedOptionId?: string | null;
}

interface AttemptData {
  id: string;
  score: number | null;
  correctAnswers: number | null;
  incorrectAnswers: number | null;
  unanswered: number | null;
  totalQuestions: number;
  status: string;
  createdAt: string;
  endTime: string | null;
  examConfig: { name: string | null; passingScore: number } | null;
  answers: AttemptAnswer[];
}

interface DifficultyMap {
  [key: string]: "facil" | "medio" | "dificil";
}

export default function ResultsPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const attemptId = params.attemptId as string;
  const [attempt, setAttempt] = useState<AttemptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewMode, setReviewMode] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status !== "authenticated") return;

    async function loadResults() {
      try {
        const res = await fetch(`/api/exams/review/attempt/${attemptId}`);
        if (!res.ok) throw new Error("Error al cargar resultados");

        const data = await res.json();
        if (!data.success) throw new Error(data.error);

        setAttempt(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    }

    loadResults();
  }, [status, router, attemptId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 container mx-auto px-4 py-8">
        <Alert className="bg-red-950 border-red-800">
          <AlertDescription className="text-red-200">{error}</AlertDescription>
        </Alert>
        <Button asChild className="mt-4 bg-orange-500 hover:bg-orange-600">
          <Link href="/dashboard">Ir al dashboard</Link>
        </Button>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="flex-1 container mx-auto px-4 py-8">
        <Alert className="bg-slate-800 border-slate-700">
          <AlertDescription className="text-slate-400">
            Intento no encontrado.
          </AlertDescription>
        </Alert>
        <Button asChild className="mt-4 bg-orange-500 hover:bg-orange-600">
          <Link href="/dashboard">Ir al dashboard</Link>
        </Button>
      </div>
    );
  }

  const passed = (attempt.score ?? 0) >= (attempt.examConfig?.passingScore ?? 0.5);
  const timeTaken = attempt.endTime
    ? Math.floor((new Date(attempt.endTime).getTime() - new Date(attempt.createdAt).getTime()) / 1000)
    : 0;

  // Show summary first
  if (!reviewMode) {
    return (
      <div className="flex-1 container mx-auto px-4 py-8">
        <ExamResults
          result={{
            totalQuestions: attempt.totalQuestions,
            correctAnswers: attempt.correctAnswers ?? 0,
            incorrectAnswers: attempt.incorrectAnswers ?? 0,
            unanswered: attempt.unanswered ?? 0,
            score: attempt.score ?? 0,
            passed,
            timeTaken,
          }}
          onReview={() => setReviewMode(true)}
          onHome={() => router.push("/dashboard")}
        />
      </div>
    );
  }

  // Review mode
  const difficultyMap: DifficultyMap = { EASY: "facil", MEDIUM: "medio", HARD: "dificil" };

  return (
    <div className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-100">
          Revisión: {attempt.examConfig?.name || "Simulacro"}
        </h1>
        <Button
          variant="outline"
          onClick={() => setReviewMode(false)}
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          ← Volver al resumen
        </Button>
      </div>

      <div className="space-y-4">
        {attempt.answers.map((answer, i) => {
          const selectedOption = answer.question.options.find(
            (o) => o.id === answer.selectedOptionId
          );
          const correctOption = answer.question.options.find((o) => o.isCorrect);
          const isCorrect = answer.isCorrect;

          return (
            <Card key={answer.question.id} className="bg-slate-900 border-slate-800 text-slate-100">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={isCorrect ? "default" : "secondary"} className={isCorrect ? "bg-green-600" : "bg-red-600"}>
                        {isCorrect ? "Correcta" : "Incorrecta"}
                      </Badge>
                      {answer.question.topic && (
                        <Badge variant="outline" className="bg-slate-800 text-slate-400">
                          {answer.question.topic.name}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{answer.question.text}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {answer.question.options.map((opt) => {
                    const isSelected = opt.id === answer.selectedOptionId;
                    const isCorrectOpt = opt.isCorrect;

                    return (
                      <div
                        key={opt.id}
                        className={`p-3 rounded-lg border ${
                          isCorrectOpt
                            ? "border-green-600 bg-green-950/30"
                            : isSelected && !isCorrectOpt
                            ? "border-red-600 bg-red-950/30"
                            : "border-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-base ${
                            isCorrectOpt ? "text-green-400" : isSelected ? "text-red-400" : "text-slate-400"
                          }`}>
                            {isCorrectOpt ? "✓" : isSelected ? "✕" : opt.id.toUpperCase().charAt(0)}
                          </span>
                          <span className="text-base text-slate-300">{opt.text}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {answer.question.explanation && (
                  <div className="mt-4 p-3 rounded-lg bg-slate-800 border border-slate-700">
                    <p className="text-base text-slate-300">
                      <span className="font-medium text-orange-500">Explicación: </span>
                      {answer.question.explanation}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <Button asChild variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
          <Link href="/dashboard">Ir al dashboard</Link>
        </Button>
        <Button asChild className="bg-orange-500 hover:bg-orange-600">
          <Link href="/simulacros">Nuevo simulacro</Link>
        </Button>
      </div>
    </div>
  );
}
