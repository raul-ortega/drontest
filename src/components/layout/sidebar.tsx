"use client";

import * as React from "react";
import { cn } from "../ui/utils";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export interface SidebarItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string;
  items?: SidebarItem[];
}

export interface SidebarProps {
  items: SidebarItem[];
  open?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ items, open = true, onToggle }: SidebarProps) {
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());

  const toggleSection = (label: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  return (
    <aside
      className={cn(
        "sticky top-16 h-[calc(100vh-4rem)] border-r border-border bg-background transition-all duration-200 flex flex-col",
        open ? "w-64" : "w-16"
      )}
    >
      {/* Toggle button */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        {open && <span className="text-sm font-semibold text-muted-foreground">Panel</span>}
        <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
          {open ? "◀" : "▶"}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {items.map((item) =>
          item.items ? (
            <div key={item.label}>
              <button
                onClick={() => toggleSection(item.label)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
                  open ? "justify-between" : "justify-center"
                )}
              >
                {item.icon && <span>{item.icon}</span>}
                {open && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                    <span className="text-xs">
                      {expanded.has(item.label) ? "▼" : "▶"}
                    </span>
                  </>
                )}
              </button>
              {open && expanded.has(item.label) && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.items!.map((sub) => (
                    <SidebarLink key={sub.href} item={sub} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <SidebarLink key={item.label} item={item} />
          )
        )}
      </nav>
    </aside>
  );
}

function SidebarLink({ item }: { item: SidebarItem }) {
  return (
    <a
      href={item.href}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
      )}
    >
      {item.icon && <span>{item.icon}</span>}
      <span className="flex-1 text-left truncate">{item.label}</span>
      {item.badge && (
        <Badge variant="secondary" className="text-xs">
          {item.badge}
        </Badge>
      )}
    </a>
  );
}
