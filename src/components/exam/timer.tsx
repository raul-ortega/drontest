import * as React from "react";
import { cn } from "../ui/utils";

export interface TimerProps {
  seconds: number;
  onExpire?: () => void;
  warningThreshold?: number;
  dangerThreshold?: number;
  className?: string;
  showLabel?: boolean;
}

export function Timer({
  seconds,
  onExpire,
  warningThreshold = 300,
  dangerThreshold = 60,
  className,
  showLabel = true,
}: TimerProps) {
  const [remaining, setRemaining] = React.useState(seconds);

  React.useEffect(() => {
    if (remaining <= 0) {
      onExpire?.();
      return;
    }

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remaining, onExpire]);

  const minutes = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const variant =
    remaining <= dangerThreshold
      ? "danger"
      : remaining <= warningThreshold
        ? "warning"
        : "normal";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showLabel && (
        <span className="text-base font-medium text-muted-foreground">Tiempo:</span>
      )}
      <span
        className={cn(
          "timer-display text-xl font-bold",
          variant === "warning" && "timer-warning",
          variant === "danger" && "timer-danger"
        )}
      >
        {formatted}
      </span>
    </div>
  );
}
