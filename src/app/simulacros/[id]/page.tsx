"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { QuestionCard } from "@/components/exam/question-card";
import { Timer } from "@/components/exam/timer";
import { ExamProgress } from "@/components/exam/exam-progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Las respuestas correctas y explicaciones no se envían mientras el examen está activo.
interface Question {
  id: string;
  text: string;
  difficulty: string;
  topicId: string;
  categoryId: string;
  options: Array<{ id: string; text: string; order: number }>;
  topic?: { name: string };
  category?: { name: string };
}

interface ExamStartData {
  attemptId: string;
  questions: Question[];
  duration: number;
  passingScore: number;
}

interface DifficultyMap {
  [key: string]: "facil" | "medio" | "dificil";
}

export default function ExamSessionPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;
  const [examData, setExamData] = useState<ExamStartData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const difficultyMap: DifficultyMap = { EASY: "facil", MEDIUM: "medio", HARD: "dificil" };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status !== "authenticated") return;

    async function startExam() {
      try {
        const res = await fetch(`/api/exams/${examId}/start`, { method: "POST" });
        if (!res.ok) throw new Error("Error al iniciar el examen");

        const data = await res.json();
        if (!data.success) throw new Error(data.error);

        setExamData(data.data);
        setTimeLeft(data.data.duration);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    }

    startExam();
  }, [status, router, examId]);

  const currentQuestion = examData?.questions[currentIndex];
  const selectedAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const answeredCount = Object.keys(answers).length;

  const handleSelect = useCallback((optionId: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  }, [currentQuestion]);

  const handleNext = () => {
    if (currentIndex < (examData?.questions.length ?? 0) - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleConfirmSubmit = async () => {
    if (!examData) return;
    setShowConfirmDialog(false);
    setSubmitting(true);

    try {
      // Build answers array
      const answersArray = examData.questions.map((q) => ({
        questionId: q.id,
        selectedOptionId: answers[q.id] || null,
        answerTime: Math.floor((examData.duration - timeLeft) / examData.questions.length),
      }));

      const res = await fetch(`/api/exams/${examId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId: examData.attemptId,
          answers: answersArray,
        }),
      });

      if (!res.ok) throw new Error("Error al entregar el examen");

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      router.push(`/resultados/${examData.attemptId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al entregar");
      setSubmitting(false);
    }
  };

  const handleTimeUp = async () => {
    if (!examData) return;
    setSubmitting(true);

    try {
      const answersArray = examData.questions.map((q) => ({
        questionId: q.id,
        selectedOptionId: answers[q.id] || null,
        answerTime: examData.duration,
      }));

      const res = await fetch(`/api/exams/${examId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId: examData.attemptId,
          answers: answersArray,
        }),
      });

      if (!res.ok) throw new Error("Error al entregar el examen");

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      router.push(`/resultados/${examData.attemptId}`);
    } catch {
      setError("Error al entregar el examen por tiempo agotado");
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!examData) return;
    setShowCancelDialog(false);
    try {
      await fetch(`/api/exams/${examId}/attempt/${examData.attemptId}/cancel`, {
        method: "DELETE",
      });
    } catch {
      // Ignore errors — still redirect
    }
    router.push("/simulacros");
  };

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
          <Link href="/simulacros">Volver a simulacros</Link>
        </Button>
      </div>
    );
  }

  if (!examData || examData.questions.length === 0) {
    return (
      <div className="flex-1 container mx-auto px-4 py-8">
        <Alert className="bg-slate-800 border-slate-700">
          <AlertDescription className="text-slate-400">
            No se pudo cargar el examen.
          </AlertDescription>
        </Alert>
        <Button asChild className="mt-4 bg-orange-500 hover:bg-orange-600">
          <Link href="/simulacros">Volver a simulacros</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
      {/* Header with timer and actions */}
      <div className="flex items-center justify-between mb-4">
        <Timer
          seconds={timeLeft}
          onExpire={handleTimeUp}
          warningThreshold={300}
          dangerThreshold={60}
          showLabel
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-red-800 text-red-400 hover:bg-red-950 hover:text-red-300"
            onClick={() => setShowCancelDialog(true)}
          >
            Cancelar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
            onClick={() => setShowConfirmDialog(true)}
          >
            Entregar
          </Button>
        </div>
      </div>

      {/* Progress */}
      <ExamProgress
        current={currentIndex + 1}
        total={examData.questions.length}
        answered={answeredCount}
      />

      {/* Question */}
      {currentQuestion && (
        <div className="mt-6">
          <QuestionCard
            question={{
              id: currentQuestion.id,
              text: currentQuestion.text,
              category: currentQuestion.category?.name,
              topic: currentQuestion.topic?.name,
              difficulty: difficultyMap[currentQuestion.difficulty] || "medio",
            }}
            options={currentQuestion.options}
            selectedOption={selectedAnswer}
            onSelect={handleSelect}
            disabled={false}
          />
        </div>
      )}

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          variant="outline"
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          ← Anterior
        </Button>

        {currentIndex === examData.questions.length - 1 ? (
          <Button
            onClick={() => setShowConfirmDialog(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white"
            disabled={submitting}
          >
            {submitting ? "Entregando..." : "Entregar examen"}
          </Button>
        ) : (
          <Button onClick={handleNext} className="bg-orange-500 hover:bg-orange-600 text-white">
            Siguiente →
          </Button>
        )}
      </div>

      {/* Confirm dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle>¿Entregar examen?</DialogTitle>
            <DialogDescription className="text-slate-400">
              Has respondido {answeredCount} de {examData.questions.length} preguntas.
              {answeredCount < examData.questions.length && (
                <span className="block mt-2 text-orange-500">
                  Tienes {examData.questions.length - answeredCount} preguntas sin responder.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Continuar
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={submitting}
            >
              {submitting ? "Entregando..." : "Entregar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle>¿Cancelar la prueba?</DialogTitle>
            <DialogDescription className="text-slate-400">
              Se perderá todo el progreso de este intento. Podrás empezar una nueva prueba después.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Seguir examinándose
            </Button>
            <Button
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
