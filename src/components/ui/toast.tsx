import * as React from "react";
import { cn } from "./utils";
import { Button } from "./button";

export type ToastVariant = "default" | "success" | "destructive";

export interface ToastData {
  id: string;
  message: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

let toasts: ToastData[] = [];
const listeners: Set<() => void> = new Set();

export const toast = {
  show(options: Omit<ToastData, "id">) {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const t: ToastData = { ...options, id };
    toasts = [...toasts, t];
    listeners.forEach((fn) => fn());
    const duration = options.duration ?? 4000;
    setTimeout(() => {
      toast.dismiss(id);
    }, duration);
  },
  dismiss(id: string) {
    toasts = toasts.filter((t) => t.id !== id);
    listeners.forEach((fn) => fn());
  },
  success(message: string, description?: string) {
    toast.show({ message, description, variant: "success" });
  },
  error(message: string, description?: string) {
    toast.show({ message, description, variant: "destructive" });
  },
  info(message: string, description?: string) {
    toast.show({ message, description, variant: "default" });
  },
};

const variantClasses: Record<ToastVariant, string> = {
  default: "border-default bg-background text-foreground",
  success:
    "border-success bg-background text-success [&>svg]:text-success",
  destructive:
    "border-destructive bg-background text-destructive [&>svg]:text-destructive",
};

export function ToastContainer() {
  const [currentToasts, setCurrentToasts] = React.useState<ToastData[]>([]);

  React.useEffect(() => {
    const listener = () => setCurrentToasts([...toasts]);
    listeners.add(listener);
    listener();
    return () => {
      listeners.delete(listener);
    };
  }, []);

  if (currentToasts.length === 0) return null;

  return (
    <div
      className="fixed right-4 top-4 z-50 flex flex-col gap-2"
      aria-live="polite"
      aria-label="Notificaciones"
    >
      {currentToasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => toast.dismiss(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({
  toast: t,
  onDismiss,
}: {
  toast: ToastData;
  onDismiss: () => void;
}) {
  return (
    <div
      className={cn(
        "min-w-[300px] max-w-sm rounded-lg border px-4 py-3 shadow-md",
        variantClasses[t.variant ?? "default"]
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="text-sm font-medium">{t.message}</p>
          {t.description && (
            <p className="mt-1 text-xs text-muted-foreground">
              {t.description}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0"
          onClick={onDismiss}
        >
          ✕
        </Button>
      </div>
    </div>
  );
}
