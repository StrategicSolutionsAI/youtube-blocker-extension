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
    <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ fontFamily: 'Inter, sans-serif' }}>
      <main className="mx-auto max-w-6xl">
        {/* Compact Header */}
        <div className="text-center py-4 sm:py-6 mb-4 sm:mb-6">
          <h1 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Bonnie&apos;s YouTube Blocker
          </h1>
          <p className="text-base sm:text-lg text-gray-600 font-light">
            Stay focused, track progress, celebrate success
          </p>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-3"></div>
        </div>
        
        {/* Desktop: Two-column layout for better space utilization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <BlockToggle />
          <CheckinForm />
        </div>
        
        {/* Combined Progress & Recent Check-ins Widget */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Progress & Recent Check-ins</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {/* Progress Stats Section */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg border border-emerald-200/50">
                <div className="text-lg sm:text-xl font-bold text-emerald-700" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {stats.totalOk}
                </div>
                <div className="text-xs text-emerald-600 font-medium">On Track</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-lg border border-rose-200/50">
                <div className="text-lg sm:text-xl font-bold text-rose-700" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {stats.totalSlip}
                </div>
                <div className="text-xs text-rose-600 font-medium">Slips</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-lg border border-amber-200/50">
                <div className="text-lg sm:text-xl font-bold text-amber-700" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {stats.currentStreak}
                </div>
                <div className="text-xs text-amber-600 font-medium">Current</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg border border-purple-200/50">
                <div className="text-lg sm:text-xl font-bold text-purple-700" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {stats.bestStreak}
                </div>
                <div className="text-xs text-purple-600 font-medium">Best</div>
              </div>
            </div>

            {/* Recent Check-ins Section */}
            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                Recent Activity
              </h4>
              {recent.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No check-ins yet. Make your first one above!</p>
              ) : (
                <ul className="divide-y divide-gray-100 space-y-0">
                  {recent.slice(0, 6).map((r) => (
                    <li key={r.date} className="py-2 first:pt-0 flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-800">{r.date}</div>
                        {r.note ? (
                          <div className="text-xs text-gray-600 mt-0.5 truncate">{r.note}</div>
                        ) : null}
                      </div>
                      <Badge variant={r.status === "ok" ? "success" : "destructive"} className="flex-shrink-0">
                        {r.status === "ok" ? "OK" : "Slip"}
                      </Badge>
                    </li>
                  ))}
                  {recent.length > 6 && (
                    <li className="py-2 text-xs text-gray-400 text-center">
                      ... and {recent.length - 6} more entries
                    </li>
                  )}
                </ul>
              )}
              {recent.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleReset}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 text-xs"
                  >
                    Reset All Progress
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
