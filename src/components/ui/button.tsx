import * as React from "react";
import { cn } from "./utils";

export type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

export type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-primary text-primary-foreground hover:bg-primary/90 shadow",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow",
  outline:
    "border border-border bg-background hover:bg-muted hover:text-muted-foreground",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-muted hover:text-muted-foreground",
  link: "text-primary underline-offset-4 hover:underline",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-10 px-4 py-2 text-sm",
  sm: "h-9 rounded-md px-3 text-xs",
  lg: "h-12 rounded-md px-8 text-base",
  icon: "h-10 w-10 flex items-center justify-center",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const baseClasses = cn(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      variantClasses[variant],
      sizeClasses[size],
      className
    );

    if (asChild && React.isValidElement(props.children)) {
      const child = props.children as React.ReactElement<{ className?: string; ref?: React.Ref<unknown> }>;
      // No propagar `children` del Button: se conservan los del elemento hijo
      // para evitar anidar etiquetas (p. ej. <a> dentro de <a>).
      const { children: _ignored, ...restProps } = props;
      return React.cloneElement(child, {
        ref: ref as React.Ref<unknown>,
        className: cn(child.props.className, baseClasses),
        ...restProps,
      });
    }

    return (
      <button
        ref={ref}
        type={props.type ?? "button"}
        className={baseClasses}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
