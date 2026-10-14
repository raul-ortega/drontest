import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(100),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(100),
  role: z.enum(["ADMIN", "USER"]).default("USER"),
});

export const CreateQuestionSchema = z.object({
  text: z.string().min(10, "El enunciado debe tener al menos 10 caracteres"),
  topicId: z.string().min(1, "Debe seleccionar un tema"),
  categoryId: z.string().min(1, "Debe seleccionar una categoría"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).default("MEDIUM"),
  explanation: z
    .string()
    .min(10, "La explicación debe tener al menos 10 caracteres")
    .optional(),
  reference: z.string().max(500).optional(),
  source: z.string().max(500).optional(),
  options: z
    .array(
      z.object({
        text: z.string().min(1, "La opción no puede estar vacía"),
        isCorrect: z.boolean(),
      })
    )
    .min(2, "Debe haber al menos 2 opciones")
    .max(6, "Máximo 6 opciones permitidas"),
});

export const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100),
  description: z.string().max(500).optional(),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const CreateTopicSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100),
  description: z.string().max(500).optional(),
  categoryId: z.string().min(1, "Debe seleccionar una categoría"),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const CreateExamConfigSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100),
  description: z.string().max(500).optional(),
  questionCount: z.number().int().min(40).max(200).default(40),
  duration: z.number().int().min(5).max(360).default(90),
  passingScore: z.number().min(0).max(1).default(0.75),
  isActive: z.boolean().default(true),
});

export const ExamSubmissionSchema = z.object({
  attemptId: z.string().min(1, "Intento inválido"),
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1, "Pregunta inválida"),
        selectedOptionId: z.string().min(1, "Opción inválida").nullable(),
      })
    )
    .min(1, "Debe responder al menos una pregunta"),
});

// Update schemas (partial)
export const UpdateQuestionSchema = z.object({
  text: z.string().min(10).optional(),
  topicId: z.string().min(1).optional(),
  categoryId: z.string().min(1).optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
  explanation: z.string().min(10).optional().nullable(),
  reference: z.string().max(500).optional().nullable(),
  source: z.string().max(500).optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  options: z
    .array(
      z.object({
        text: z.string().min(1),
        isCorrect: z.boolean(),
        order: z.number().int().min(0).default(0),
      })
    )
    .min(2)
    .max(6)
    .optional(),
});

export const UpdateCategorySchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const UpdateTopicSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  categoryId: z.string().min(1).optional(),
  description: z.string().max(500).optional().nullable(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const UpdateExamConfigSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  categoryId: z.string().optional().nullable(),
  topicId: z.string().optional().nullable(),
  questionCount: z.number().int().min(1).max(200).optional(),
  duration: z.number().int().min(5).max(360).optional(),
  passingScore: z.number().min(0).max(1).optional(),
  isActive: z.boolean().optional(),
});

// Export inferred types
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type CreateQuestionInput = z.infer<typeof CreateQuestionSchema>;
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type CreateTopicInput = z.infer<typeof CreateTopicSchema>;
export type CreateExamConfigInput = z.infer<typeof CreateExamConfigSchema>;
export type ExamSubmissionInput = z.infer<typeof ExamSubmissionSchema>;
export type UpdateQuestionInput = z.infer<typeof UpdateQuestionSchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
export type UpdateTopicInput = z.infer<typeof UpdateTopicSchema>;
export type UpdateExamConfigInput = z.infer<typeof UpdateExamConfigSchema>;
