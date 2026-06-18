export function todayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isYesterday(dateKey: string, today: Date = new Date()): boolean {
  const y = new Date(today);
  y.setDate(y.getDate() - 1);
  return dateKey === todayKey(y);
}
