import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "destructive";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    default: "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-amber-200 shadow-sm",
    success: "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border-emerald-200 shadow-sm",
    destructive: "bg-gradient-to-r from-rose-50 to-rose-100 text-rose-800 border-rose-200 shadow-sm",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
