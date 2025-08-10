"use client";

import React, { useState, useEffect } from "react";
import { StatsCard } from "@/components/stats-card";
import { CheckinForm } from "@/components/checkin-form";
import { BlockToggle } from "@/components/block-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Checkin {
  date: string;
  status: "ok" | "slip";
  note: string | null;
  created_at: number;
}

interface Stats {
  totalOk: number;
  totalSlip: number;
  currentStreak: number;
  bestStreak: number;
  lastSlipDate: string | null;
}

function calculateStats(checkins: Checkin[]): Stats {
  let totalOk = 0;
  let totalSlip = 0;
  
  for (const checkin of checkins) {
    if (checkin.status === "ok") {
      totalOk++;
    } else {
      totalSlip++;
    }
  }

  // Calculate streaks
  const sorted = checkins.sort((a, b) => a.date.localeCompare(b.date));
  let currentStreak = 0;
  let bestStreak = 0;
  let running = 0;
  let lastSlipDate: string | null = null;

  for (const checkin of sorted) {
    if (checkin.status === "ok") {
      running++;
      currentStreak = running;
      bestStreak = Math.max(bestStreak, running);
    } else {
      running = 0;
      currentStreak = 0;
      lastSlipDate = checkin.date;
    }
  }

  return {
    totalOk,
    totalSlip,
    currentStreak,
    bestStreak,
    lastSlipDate
  };
}

export default function Home() {
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalOk: 0,
    totalSlip: 0,
    currentStreak: 0,
    bestStreak: 0,
    lastSlipDate: null
  });

  useEffect(() => {
    // Load checkins from localStorage
    const stored = localStorage.getItem('youtube-checkins');
    if (stored) {
      const parsedCheckins = JSON.parse(stored) as Checkin[];
      setCheckins(parsedCheckins);
      setStats(calculateStats(parsedCheckins));
    }
  }, []);

  const recent = checkins
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 14);

  const handleReset = () => {
    const confirmed = window.confirm(
"Are you sure you want to reset all progress?\n\nThis will permanently delete:\n• All check-ins\n• Statistics and streaks\n• Progress history\n\nThis action cannot be undone."
    );
    
    if (confirmed) {
      localStorage.removeItem('youtube-blocker-checkins');
      setCheckins([]);
      setStats({
        totalOk: 0,
        totalSlip: 0,
        currentStreak: 0,
        bestStreak: 0,
        lastSlipDate: null
      });
    }
  };

  return (
    <div className="font-sans min-h-screen p-6 sm:p-10">
      <main className="mx-auto max-w-3xl flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Bonnie&apos;s YouTube Blocker App</h1>
        <BlockToggle />
        <StatsCard stats={stats} />
        <CheckinForm />
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Recent Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <p className="text-sm text-black/60 dark:text-white/60">No check-ins yet. Make your first one above.</p>
            ) : (
              <ul className="divide-y divide-black/10 dark:divide-white/10">
                {recent.map((r) => (
                  <li key={r.date} className="py-2 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium">{r.date}</div>
                      {r.note ? (
                        <div className="text-xs text-black/70 dark:text-white/70 mt-1">{r.note}</div>
                      ) : null}
                    </div>
                    <Badge variant={r.status === "ok" ? "success" : "destructive"}>
                      {r.status === "ok" ? "OK" : "Slip"}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
            {recent.length > 0 && (
              <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleReset}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20 border border-red-200 dark:border-red-800"
                >
                  Reset All Progress
                </Button>
                <p className="text-xs text-black/50 dark:text-white/50 mt-2">
                  This will permanently delete all check-ins and statistics
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
