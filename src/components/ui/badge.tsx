import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "destructive" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const base = "inline-flex items-center rounded px-2 py-1 text-xs font-medium";
  const variants: Record<string, string> = {
    default: "bg-black text-white dark:bg-white dark:text-black",
    success: "bg-green-600/10 text-green-700 dark:text-green-400",
    destructive: "bg-red-600/10 text-red-700 dark:text-red-400",
    outline: "border border-black/10 dark:border-white/10 text-black dark:text-white",
  };
  return <span className={cn(base, variants[variant], className)} {...props} />;
}
