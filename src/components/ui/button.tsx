import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost";
  size?: "sm" | "md";
}

export function Button({ className, variant = "default", size = "md", ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    default: "bg-black text-white dark:bg-white dark:text-black hover:opacity-90",
    ghost: "bg-transparent hover:bg-black/5 dark:hover:bg-white/10",
  };
  const sizes: Record<string, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
  };
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}
