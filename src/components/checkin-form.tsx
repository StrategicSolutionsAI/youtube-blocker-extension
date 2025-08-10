"use client";

import React, { useState } from "react";
import { todayLocal } from "@/lib/date";
import { ConfettiButton } from "@/components/confetti-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function CheckinForm() {
  const [status, setStatus] = useState<"ok" | "slip">("ok");
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to localStorage
    const checkin = {
      date: todayLocal(),
      status,
      note: note.trim() || null,
      created_at: Date.now()
    };
    
    // Get existing checkins
    const existing = JSON.parse(localStorage.getItem('youtube-checkins') || '[]');
    
    // Remove any existing checkin for today and add new one
    const filtered = existing.filter((c: { date: string }) => c.date !== checkin.date);
    filtered.push(checkin);
    
    // Save back to localStorage
    localStorage.setItem('youtube-checkins', JSON.stringify(filtered));
    
    // Reset form
    setNote("");
    
    // Trigger page refresh to update stats
    window.location.reload();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Daily Check-in</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">How did you do today?</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name="status" 
                  value="ok" 
                  checked={status === "ok"}
                  onChange={(e) => setStatus(e.target.value as "ok" | "slip")}
                  className="text-green-600" 
                />
                <span>On track (no YouTube)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name="status" 
                  value="slip" 
                  checked={status === "slip"}
                  onChange={(e) => setStatus(e.target.value as "ok" | "slip")}
                  className="text-red-600" 
                />
                <span>Slip (used YouTube)</span>
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="note" className="text-sm font-medium">
              Notes (optional)
            </label>
            <Textarea
              id="note"
              name="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="How are you feeling? Any challenges or wins?"
              className="min-h-[80px]"
            />
          </div>
          <ConfettiButton type="submit" className="w-full">
            Save Check-in
          </ConfettiButton>
        </form>
      </CardContent>
    </Card>
  );
}
