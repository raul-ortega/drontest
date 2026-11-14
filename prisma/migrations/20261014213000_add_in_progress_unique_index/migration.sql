-- Garantiza que un usuario no puede tener más de un intento IN_PROGRESS
-- por configuración de examen, incluso ante peticiones concurrentes
-- (p. ej. doble efecto de React StrictMode en modo desarrollo).
-- Los intentos terminados (SUBMITTED/EXPIRED/CANCELLED) no afectan al índice.
CREATE UNIQUE INDEX "ExamAttempt_user_config_in_progress_unique"
  ON "ExamAttempt" ("userId", "examConfigId")
  WHERE "status" = 'IN_PROGRESS';
