import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { todayLocal } from "./date";
export { todayLocal } from "./date";

export interface Checkin {
  date: string; // YYYY-MM-DD
  status: "ok" | "slip";
  note: string | null;
  created_at: number; // epoch ms
}

export interface Stats {
  totalOk: number;
  totalSlip: number;
  currentStreak: number;
  bestStreak: number;
  lastSlipDate: string | null;
}

function getEnvSuffix(): string {
  const env = process.env.NODE_ENV || "development";
  if (env === "production") return "prod";
  if (env === "test") return "test";
  return "dev";
}

const dataDir = path.join(process.cwd(), "var", "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, `app-${getEnvSuffix()}.db`);
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS checkins (
  date TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('ok','slip')),
  note TEXT,
  created_at INTEGER NOT NULL
);
`);

function pad(n: number): string { return n < 10 ? `0${n}` : String(n); }

export function upsertCheckin(date: string, status: "ok" | "slip", note: string | null): void {
  const stmt = db.prepare(
    `INSERT INTO checkins (date, status, note, created_at)
     VALUES (@date, @status, @note, @created_at)
     ON CONFLICT(date) DO UPDATE SET status=excluded.status, note=excluded.note`
  );
  stmt.run({ date, status, note, created_at: Date.now() });
}

export function getCheckins(limit: number = 60): Checkin[] {
  const stmt = db.prepare(
    `SELECT date, status, note, created_at
     FROM checkins
     ORDER BY date DESC
     LIMIT ?`
  );
  return stmt.all(limit) as Checkin[];
}

export function getCheckinByDate(date: string): Checkin | null {
  const stmt = db.prepare(
    `SELECT date, status, note, created_at FROM checkins WHERE date = ?`
  );
  const row = stmt.get(date) as Checkin | undefined;
  return row ?? null;
}

export function getStats(): Stats {
  const rows = db.prepare(`SELECT date, status FROM checkins ORDER BY date ASC`).all() as {date: string; status: "ok"|"slip";}[];
  let totalOk = 0;
  let totalSlip = 0;
  for (const r of rows) {
    if (r.status === "ok") {
      totalOk++;
    } else {
      totalSlip++;
    }
  }

  // Compute streaks based on consecutive days with status = 'ok' until a gap or a slip.
  let currentStreak = 0;
  let bestStreak = 0;
  let running = 0;
  let lastDate: string | null = null;
  let lastSlipDate: string | null = null;

  function isNextDay(prev: string, next: string): boolean {
    const [py, pm, pd] = prev.split("-").map(Number);
    const [ny, nm, nd] = next.split("-").map(Number);
    const prevDate = new Date(py, pm - 1, pd);
    const nextDate = new Date(ny, nm - 1, nd);
    const diffDays = Math.round((nextDate.getTime() - prevDate.getTime()) / 86400000);
    return diffDays === 1;
  }

  for (const r of rows) {
    if (r.status === "slip") {
      if (running > bestStreak) bestStreak = running;
      running = 0;
      lastSlipDate = r.date;
      lastDate = r.date;
      continue;
    }
    if (lastDate && !isNextDay(lastDate, r.date)) {
      if (running > bestStreak) bestStreak = running;
      running = 0;
    }
    running += 1;
    if (running > bestStreak) bestStreak = running;
    lastDate = r.date;
  }

  // Determine current streak as consecutive 'ok' days ending today or yesterday depending on recorded dates
  const today = todayLocal();
  const last = rows.length ? rows[rows.length - 1].date : null;
  if (last) {
    if (last === today) {
      // last day is today
      // count back until slip or gap
      let count = 0;
      for (let i = rows.length - 1; i >= 0; i--) {
        const r = rows[i];
        if (r.status !== "ok") break;
        if (i < rows.length - 1) {
          if (!isNextDay(rows[i].date, rows[i + 1].date)) break;
        }
        count++;
      }
      currentStreak = count;
    } else {
      // if last is yesterday and it's ok, still counts as current streak ongoing
      const [ty, tm, td] = today.split("-").map(Number);
      const yest = new Date(ty, tm - 1, td - 1);
      const yestStr = `${yest.getFullYear()}-${pad(yest.getMonth() + 1)}-${pad(yest.getDate())}`;
      if (last === yestStr && rows[rows.length - 1].status === "ok") {
        // count till yesterday
        let count = 0;
        for (let i = rows.length - 1; i >= 0; i--) {
          const r = rows[i];
          if (r.status !== "ok") break;
          if (i < rows.length - 1) {
            if (!isNextDay(rows[i].date, rows[i + 1].date)) break;
          }
          count++;
        }
        currentStreak = count;
      } else {
        currentStreak = 0;
      }
    }
  } else {
    currentStreak = 0;
  }

  return { totalOk, totalSlip, currentStreak, bestStreak, lastSlipDate };
}

// Test helper: clears data when NODE_ENV=test
export function __resetForTests__(): void {
  if ((process.env.NODE_ENV || "development") !== "test") return;
  db.exec("DELETE FROM checkins;");
}
