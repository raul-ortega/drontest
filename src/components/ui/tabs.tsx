import * as React from "react";
import { cn } from "./utils";

export type TabItem = {
  value: string;
  label: string;
};

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (value: string) => void;
  className?: string;
}

const Tabs = ({ tabs, activeTab, onChange, className }: TabsProps) => (
  <div className={cn("w-full", className)}>
    <div
      role="tablist"
      className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1"
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={activeTab === tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            activeTab === tab.value
              ? "bg-background text-foreground shadow"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  </div>
);

export { Tabs };
