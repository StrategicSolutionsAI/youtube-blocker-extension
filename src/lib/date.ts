function pad(n: number): string { return n < 10 ? `0${n}` : String(n); }

export function todayLocal(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  return `${y}-${m}-${day}`;
}
