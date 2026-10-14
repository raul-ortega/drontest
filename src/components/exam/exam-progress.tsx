import * as React from "react";
import { cn } from "../ui/utils";

export interface ExamProgressProps {
  current: number;
  total: number;
  answered: number;
  className?: string;
}

export function ExamProgress({
  current,
  total,
  answered,
  className,
}: ExamProgressProps) {
  const percentage = total > 0 ? (answered / total) * 100 : 0;

  return (
    <div className={cn("w-full space-y-2", className)}>
      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-base">
        <span className="text-muted-foreground">
          Pregunta {current} de {total}
        </span>
        <span className="font-medium">
          {answered}/{total} respondidas
        </span>
      </div>

      {/* Question dots */}
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: total }, (_, i) => i + 1).map((num) => {
          const isAnswered = num <= answered;
          const isCurrent = num === current;

          return (
            <span
              key={num}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
                isCurrent
                  ? "bg-accent text-accent-foreground"
                  : isAnswered
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
              )}
            >
              {num}
            </span>
          );
        })}
      </div>
    </div>
  );
}
