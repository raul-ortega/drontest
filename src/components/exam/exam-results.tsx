import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";

export interface ExamResult {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  score: number;
  passed: boolean;
  timeTaken: number;
  categoryStats?: Array<{
    category: string;
    total: number;
    correct: number;
  }>;
}

export interface ExamResultsProps {
  result: ExamResult;
  onRetry?: () => void;
  onReview?: () => void;
  onHome?: () => void;
}

export function ExamResults({ result, onRetry, onReview, onHome }: ExamResultsProps) {
  const percentage =
    result.totalQuestions > 0
      ? Math.round((result.correctAnswers / result.totalQuestions) * 100)
      : 0;

  const minutes = Math.floor(result.timeTaken / 60);
  const seconds = result.timeTaken % 60;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
          <span className="text-4xl">
            {result.passed ? "🎉" : "📋"}
          </span>
        </div>
        <CardTitle className={cn(
          "text-2xl",
          result.passed ? "text-success" : "text-destructive"
        )}>
          {result.passed ? "¡Aprobado!" : "No aprobado"}
        </CardTitle>
        <CardDescription>
          Has obtenido un {percentage}% de aciertos
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Score summary */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Correctas" value={String(result.correctAnswers)} className="text-success" />
          <StatCard label="Incorrectas" value={String(result.incorrectAnswers)} className="text-destructive" />
          <StatCard label="Sin responder" value={String(result.unanswered)} />
          <StatCard label="Tiempo" value={`${minutes}m ${seconds}s`} />
        </div>

        {/* Score bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-base">
            <span className="text-muted-foreground">Puntuación</span>
            <span className="font-bold">{percentage}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                result.passed ? "bg-success" : "bg-destructive"
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Category stats */}
        {result.categoryStats && result.categoryStats.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-base font-medium">Desglose por categoría</h4>
            {result.categoryStats.map((stat) => (
              <div key={stat.category} className="flex items-center justify-between rounded-md border border-border p-3">
                <span className="text-base">{stat.category}</span>
                <Badge variant="outline">
                  {stat.correct}/{stat.total}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row gap-2 justify-center">
        {onReview && (
          <Button variant="outline" onClick={onReview}>
            Revisar respuestas
          </Button>
        )}
        {onRetry && (
          <Button variant="default" onClick={onRetry}>
            Repetir examen
          </Button>
        )}
        {onHome && (
          <Button variant="ghost" onClick={onHome}>
            Volver al inicio
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function StatCard({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/50 p-3 text-center">
      <p className={cn("text-2xl font-bold", className)}>{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
