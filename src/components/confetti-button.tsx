"use client";

import React, { useCallback, useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ConfettiButtonProps extends ButtonProps {
  burstDurationMs?: number;
}

export function ConfettiButton({
  className,
  burstDurationMs = 1200,
  onClick,
  children,
  ...props
}: ConfettiButtonProps) {
  const [isBursting, setIsBursting] = useState(false);

  const handleClick = useCallback<NonNullable<ButtonProps["onClick"]>>(
    (e) => {
      const btn = e.currentTarget as HTMLButtonElement;
      const isSubmit = btn.type === 'submit';

      // Only burst when submitting with status=ok selected
      let shouldBurst = true;
      if (isSubmit && btn.form) {
        const selected = btn.form.querySelector<HTMLInputElement>('input[name="status"]:checked');
        shouldBurst = selected ? selected.value === 'ok' : true; // default to ok
      }

      if (shouldBurst) {
        if (!isBursting) {
          setIsBursting(true);
          window.setTimeout(() => setIsBursting(false), burstDurationMs);
        }

        if (isSubmit && btn.form) {
          // Pause submission briefly so the confetti is visible
          e.preventDefault();
          const delay = Math.min(600, Math.max(300, Math.floor(burstDurationMs * 0.5)));
          window.setTimeout(() => {
            btn.form?.requestSubmit(btn);
          }, delay);
          onClick?.(e);
          return;
        }
      }

      onClick?.(e);
    },
    [isBursting, burstDurationMs, onClick]
  );

  return (
    <span className={cn("relative inline-flex confetti-btn")}> 
      <Button {...props} className={className} onClick={handleClick}>
        {children}
      </Button>
      {/* Confetti overlay */}
      <span className={cn("pointer-events-none absolute inset-0 overflow-visible", isBursting && "confetti-active")}
        aria-hidden>
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} className={cn("confetti-piece", `cp-${i + 1}`)} />
        ))}
      </span>
    </span>
  );
}
