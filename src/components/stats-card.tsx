import React from "react";
import type { Stats } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface StatsCardProps {
  stats: Stats;
}

export function StatsCard({ stats }: StatsCardProps) {
  const items = [
    { label: "Current Streak", value: stats.currentStreak },
    { label: "Best Streak", value: stats.bestStreak },
    { label: "Total OK", value: stats.totalOk },
    { label: "Total Slips", value: stats.totalSlip },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {items.map((it) => (
            <div key={it.label} className="rounded-lg border border-black/10 dark:border-white/10 p-3">
              <div className="text-xs text-black/60 dark:text-white/60">{it.label}</div>
              <div className="text-2xl font-bold mt-1">{it.value}</div>
            </div>
          ))}
        </div>
        <div className="text-xs text-black/60 dark:text-white/60 mt-4">
          Last slip: {stats.lastSlipDate ?? "—"}
        </div>
      </CardContent>
    </Card>
  );
}
