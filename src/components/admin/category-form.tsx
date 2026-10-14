import * as React from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { toast } from "../ui/toast";

export interface CategoryFormData {
  name: string;
  description?: string;
  examDuration?: number;
  passingScore?: number;
  questionCount?: number;
}

export interface CategoryFormProps {
  initialData?: CategoryFormData;
  onSubmit: (data: CategoryFormData) => void;
  onCancel?: () => void;
}

export function CategoryForm({ initialData, onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName] = React.useState(initialData?.name ?? "");
  const [description, setDescription] = React.useState(initialData?.description ?? "");
  const [examDuration, setExamDuration] = React.useState(initialData?.examDuration ?? 90);
  const [passingScore, setPassingScore] = React.useState(initialData?.passingScore ?? 70);
  const [questionCount, setQuestionCount] = React.useState(initialData?.questionCount ?? 30);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "El nombre es obligatorio";
    if (name.trim().length < 2) newErrors.name = "Mínimo 2 caracteres";
    if (examDuration < 1) newErrors.examDuration = "Duración mínima: 1 minuto";
    if (passingScore < 0 || passingScore > 100) newErrors.passingScore = "Debe estar entre 0 y 100";
    if (questionCount < 1) newErrors.questionCount = "Mínimo 1 pregunta";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      examDuration,
      passingScore,
      questionCount,
    });

    toast.success(initialData ? "Categoría actualizada" : "Categoría creada");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre de la categoría"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        placeholder="Ej: Legislación, Técnica..."
        required
      />

      <Textarea
        label="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe brevemente esta categoría..."
        rows={2}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Duración del examen (min)"
          type="number"
          value={examDuration}
          onChange={(e) => setExamDuration(Number(e.target.value))}
          error={errors.examDuration}
          min={1}
        />
        <Input
          label="Nota de aprobación (%)"
          type="number"
          value={passingScore}
          onChange={(e) => setPassingScore(Number(e.target.value))}
          error={errors.passingScore}
          min={0}
          max={100}
        />
        <Input
          label="Nº preguntas por examen"
          type="number"
          value={questionCount}
          onChange={(e) => setQuestionCount(Number(e.target.value))}
          error={errors.questionCount}
          min={1}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" variant="default">
          {initialData ? "Actualizar" : "Crear"} categoría
        </Button>
      </div>
    </form>
  );
}
