import * as React from "react";
import { cn } from "../ui/utils";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

export interface QuestionOption {
  id: string;
  text: string;
}

export interface QuestionCardProps {
  question: {
    id: string;
    text: string;
    category?: string;
    topic?: string;
    difficulty?: "facil" | "medio" | "dificil";
  };
  options: QuestionOption[];
  selectedOption?: string;
  correctOptionId?: string;
  showResult?: boolean;
  onSelect?: (optionId: string) => void;
  disabled?: boolean;
}

export function QuestionCard({
  question,
  options,
  selectedOption,
  correctOptionId,
  showResult = false,
  onSelect,
  disabled = false,
}: QuestionCardProps) {
  const difficultyLabel: Record<string, string> = {
    facil: "Fácil",
    medio: "Medio",
    dificil: "Difícil",
  };

  const difficultyVariant: Record<string, "default" | "secondary" | "destructive"> = {
    facil: "default",
    medio: "secondary",
    dificil: "destructive",
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {/* Question header */}
        <div className="mb-4 flex items-start justify-between gap-2">
          <h3 className="text-xl font-medium leading-relaxed flex-1">
            {question.text}
          </h3>
          {question.category && (
            <Badge variant="outline" className="shrink-0">
              {question.category}
            </Badge>
          )}
        </div>

        {/* Difficulty badge */}
        {question.difficulty && (
          <div className="mb-4">
            <Badge variant={difficultyVariant[question.difficulty]}>
              {difficultyLabel[question.difficulty]}
            </Badge>
          </div>
        )}

        {/* Topic */}
        {question.topic && (
          <p className="mb-4 text-sm text-muted-foreground">{question.topic}</p>
        )}

        {/* Options */}
        <div className="space-y-2">
          {options.map((option, index) => {
            const isSelected = selectedOption === option.id;
            const isCorrect = correctOptionId === option.id;
            const showCorrect = showResult && isCorrect;
            const showIncorrect = showResult && isSelected && !isCorrect;

            return (
              <div
                key={option.id}
                className={cn(
                  "exam-option flex items-center gap-3",
                  isSelected && !showResult && "selected",
                  showCorrect && "correct",
                  showIncorrect && "incorrect"
                )}
                onClick={() => !disabled && onSelect?.(option.id)}
                role="radio"
                aria-checked={isSelected}
                aria-disabled={disabled}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-medium border",
                    showCorrect
                      ? "bg-success border-success text-success-foreground"
                      : showIncorrect
                        ? "bg-destructive border-destructive text-destructive-foreground"
                        : isSelected
                          ? "bg-accent border-accent text-accent-foreground"
                          : "border-border text-muted-foreground"
                  )}
                >
                  {showCorrect ? "✓" : showIncorrect ? "✕" : String.fromCharCode(65 + index)}
                </span>
                <span className="text-base">{option.text}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
