"use client";

import * as React from "react";
import { cn } from "./utils";

// ---------- Select (shadcn/ui style) ----------

interface SelectContextValue {
  value: string;
  onValueChange: (val: string) => void;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

const Select = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string;
    onValueChange?: (val: string) => void;
  }
>(({ value, onValueChange, children, ...props }, ref) => (
  <SelectContext.Provider value={{ value: value ?? "", onValueChange: onValueChange ?? (() => {}) }}>
    <div ref={ref} {...props}>
      {children}
    </div>
  </SelectContext.Provider>
));
Select.displayName = "Select";

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    placeholder?: string;
  }
>(({ className, placeholder, children, ...props }, ref) => {
  const ctx = React.useContext(SelectContext);

  // Find the selected item's children
  let selectedLabel = placeholder ?? "";
  if (ctx?.value) {
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        const childValue = (child.props as Record<string, unknown>)?.value as string | undefined;
        if (childValue === ctx.value && (child.props as Record<string, unknown>)?.children) {
          selectedLabel = String((child.props as Record<string, unknown>)?.children);
        }
      }
    });
  }

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm ring-ring placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span className={ctx?.value ? "" : "text-muted-foreground"}>
        {selectedLabel}
      </span>
      <svg className="ml-2 h-4 w-4 fill-current opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative z-50 max-h-60 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover py-1 shadow-md",
      className
    )}
  >
    <div className="py-1">{children}</div>
  </div>
));
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, children, ...props }, ref) => {
  const ctx = React.useContext(SelectContext);
  const selected = ctx?.value === value;

  return (
    <div
      ref={ref}
      role="option"
      aria-selected={selected}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        selected && "bg-accent text-accent-foreground",
        className
      )}
      onClick={() => ctx?.onValueChange?.(value)}
      {...props}
    >
      {children}
      {selected && (
        <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
          </svg>
        </span>
      )}
    </div>
  );
});
SelectItem.displayName = "SelectItem";

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }
>(({ className, placeholder }, ref) => {
  return (
    <span ref={ref} className={cn("text-sm", className)}>
      {placeholder}
    </span>
  );
});
SelectValue.displayName = "SelectValue";

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
