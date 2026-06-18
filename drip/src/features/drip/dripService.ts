import fallbackDrips from '@/src/content/fallbackDrips.json';
import type { Drip } from './dripTypes';

export const ALL_DRIPS: Drip[] = fallbackDrips as Drip[];

export function getDripById(id: number): Drip | undefined {
  return ALL_DRIPS.find((d) => d.id === id);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Mirrors the PRD's "get_next_drip" edge-function flow (section 7): pick an
// active drip the user hasn't just seen. Implemented as a local shuffle-bag
// so every drip is seen once before any repeats, then the bag reshuffles.
export function drawNextDripId(queue: number[], lastDripId: number | null): { dripId: number; queue: number[] } {
  let q = queue;
  if (q.length === 0) {
    q = shuffle(ALL_DRIPS.map((d) => d.id));
    if (q[0] === lastDripId && q.length > 1) {
      [q[0], q[1]] = [q[1], q[0]];
    }
  }
  const [dripId, ...rest] = q;
  return { dripId, queue: rest };
}

// Local calendar date (not UTC), since daily resets should follow the
// user's own timezone per the PRD's `daily_usage.usage_date` semantics.
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

export function relativeTime(timestamp: number, now: number = Date.now()): string {
  const diffMs = now - timestamp;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  if (isYesterday(todayKey(new Date(timestamp)), new Date(now))) return 'Yesterday';
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}
