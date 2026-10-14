"use client";

import * as React from "react";
import { cn } from "./utils";

// ---------- Dropdown Menu (shadcn/ui style) ----------

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  align: "start" | "end" | "center";
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue>({
  open: false,
  setOpen: () => {},
  align: "start",
});

const DropdownMenu = ({ children, align = "start" }: {
  children: React.ReactNode;
  align?: "start" | "end" | "center";
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, align }}>
      <div className="relative inline-block">{children}</div>
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger = ({ children, asChild }: {
  children: React.ReactNode;
  asChild?: boolean;
}) => {
  const { setOpen } = React.useContext(DropdownMenuContext);

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ className?: string; onClick?: () => void }>;
    return React.cloneElement(child, {
      onClick: () => setOpen((prev: boolean) => !prev),
      className: cn(child.props.className, "cursor-pointer"),
    });
  }

  return (
    <button
      type="button"
      onClick={() => setOpen((prev: boolean) => !prev)}
    >
      {children}
    </button>
  );
};

const DropdownMenuContent = ({ children, align = "end", className }: {
  children: React.ReactNode;
  align?: "start" | "end" | "center";
  className?: string;
}) => {
  const { open, align: menuAlign } = React.useContext(DropdownMenuContext);

  if (!open) return null;

  const alignClass = menuAlign === "end" ? "right-0" : menuAlign === "center" ? "left-1/2 -translate-x-1/2" : "left-0";

  return (
    <div
      data-dropdown-menu-content
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 shadow-md",
        "top-full mt-1",
        alignClass,
        className
      )}
    >
      {children}
    </div>
  );
};

const DropdownMenuItem = ({ children, onClick, className, destructive, asChild }: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  destructive?: boolean;
  asChild?: boolean;
}) => {
  const { setOpen } = React.useContext(DropdownMenuContext);

  const handleClick = () => {
    onClick?.();
    setOpen(false);
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ className?: string; onClick?: () => void }>;
    return React.cloneElement(child, {
      onClick: handleClick,
      className: cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
        destructive && "text-destructive hover:bg-destructive/10 hover:text-destructive",
        child.props.className,
        className
      ),
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
        destructive && "text-destructive hover:bg-destructive/10 hover:text-destructive",
        className
      )}
    >
      {children}
    </button>
  );
};

const DropdownMenuLabel = ({ children, className }: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("px-2 py-1.5 text-sm font-semibold", className)}>
    {children}
  </div>
);

const DropdownMenuSeparator = ({ className }: {
  className?: string;
}) => (
  <div className={cn("-mx-1 my-1 h-px bg-muted", className)} />
);

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
};
