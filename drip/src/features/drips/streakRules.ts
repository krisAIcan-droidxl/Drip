import { isYesterday, todayKey } from '@/src/utils/date';

export interface StreakState {
  current: number;
  lastOpenedDateKey: string | null;
}

export function updateStreakOnDailyOpen(state: StreakState, now: Date = new Date()): StreakState {
  const today = todayKey(now);
  if (state.lastOpenedDateKey === today) return state;

  if (state.lastOpenedDateKey && isYesterday(state.lastOpenedDateKey, now)) {
    return {
      current: state.current + 1,
      lastOpenedDateKey: today,
    };
  }

  return {
    current: 1,
    lastOpenedDateKey: today,
  };
}
