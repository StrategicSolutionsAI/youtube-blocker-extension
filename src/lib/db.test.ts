import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { __resetForTests__, upsertCheckin, getStats, getCheckins, todayLocal } from "@/lib/db";

// Run tests with NODE_ENV=test to isolate DB file

describe("db progress logic", () => {
  const fixedNow = new Date("2025-01-10T12:00:00Z");

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedNow);
    __resetForTests__();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("computes streaks and counts correctly", () => {
    // Insert a slip a few days before
    upsertCheckin("2025-01-05", "slip", "watched accidentally");
    // 3-day ok streak ending today
    upsertCheckin("2025-01-08", "ok", null);
    upsertCheckin("2025-01-09", "ok", null);
    upsertCheckin("2025-01-10", "ok", "feels good");

    const stats = getStats();
    expect(stats.totalOk).toBe(3);
    expect(stats.totalSlip).toBe(1);
    expect(stats.currentStreak).toBe(3);
    expect(stats.bestStreak).toBeGreaterThanOrEqual(3);
    expect(stats.lastSlipDate).toBe("2025-01-05");
  });

  it("upserts same date entries", () => {
    upsertCheckin("2025-01-10", "slip", "changed my mind");
    const stats = getStats();
    // Now totalOk reduced by 1, slips increased by 1
    expect(stats.totalOk).toBe(2);
    expect(stats.totalSlip).toBe(2);
  });

  it("returns recent checkins in descending date order", () => {
    const recent = getCheckins(10);
    expect(recent[0]?.date).toBe("2025-01-10");
    expect(recent[recent.length - 1]?.date).toBe("2025-01-05");
  });

  it("todayLocal returns YYYY-MM-DD", () => {
    const t = todayLocal();
    expect(t).toBe("2025-01-10");
  });
});
