import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-md border border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/30 p-2 text-sm min-h-20",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
