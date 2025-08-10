import React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-amber-100 bg-gradient-to-br from-white to-amber-50/30 shadow-lg shadow-amber-100/20 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-amber-100/30 hover:-translate-y-0.5",
        className
      )}
      style={{
        boxShadow: '0 8px 32px rgba(212, 175, 55, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)'
      }}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-4 sm:p-6 pb-2 sm:pb-3", className)} {...props} />
  );
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-xl sm:text-2xl font-semibold leading-tight tracking-tight text-gray-800", className)}
      style={{ fontFamily: 'Playfair Display, serif' }}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 sm:p-6 pt-0", className)} {...props} />;
}
