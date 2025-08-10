import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "elegant";
  size?: "sm" | "md" | "lg";
}

export function Button({ className, variant = "default", size = "md", ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50 disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    default: "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-amber-700 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5",
    ghost: "bg-white/60 backdrop-blur-sm border border-amber-200 text-gray-700 hover:bg-amber-50 hover:border-amber-300 hover:shadow-md",
    elegant: "bg-gradient-to-r from-gray-50 to-white border border-gray-200 text-gray-700 shadow-sm hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5"
  };
  const sizes: Record<string, string> = {
    sm: "h-9 px-4 text-sm font-medium",
    md: "h-11 px-6 text-sm font-medium",
    lg: "h-12 px-8 text-base font-medium",
  };
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}
