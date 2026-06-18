import { FREE_EXTRA_DRIPS_PER_DAY } from '@/src/constants/product';
import type { Drip, PremiumEntitlement } from '@/src/types/domain';
import { todayKey } from '@/src/utils/date';

export interface DailyDripState {
  dateKey: string | null;
  primaryDripId: Drip['id'] | null;
  extraDripsOpened: number;
  openedDripIds: Array<Drip['id']>;
}

export interface SelectDailyDripInput {
  drips: Drip[];
  state: DailyDripState;
  entitlement: PremiumEntitlement;
  now?: Date;
}

export type SelectDailyDripResult = {
  ok: true;
  drip: Drip;
  nextState: DailyDripState;
  isPrimary: boolean;
} | {
  ok: false;
  reason: 'empty_pool' | 'daily_limit';
  nextState: DailyDripState;
};

export function resetDailyStateIfNeeded(state: DailyDripState, now: Date = new Date()): DailyDripState {
  const date = todayKey(now);
  if (state.dateKey === date) return state;
  return {
    dateKey: date,
    primaryDripId: null,
    extraDripsOpened: 0,
    openedDripIds: [],
  };
}

export function canOpenExtraDrip(entitlement: PremiumEntitlement, extraDripsOpened: number): boolean {
  return entitlement.isPremium || extraDripsOpened < FREE_EXTRA_DRIPS_PER_DAY;
}

export function selectDailyDrip(input: SelectDailyDripInput): SelectDailyDripResult {
  const state = resetDailyStateIfNeeded(input.state, input.now);
  if (input.drips.length === 0) {
    return { ok: false, reason: 'empty_pool', nextState: state };
  }

  if (state.primaryDripId) {
    if (!canOpenExtraDrip(input.entitlement, state.extraDripsOpened)) {
      return { ok: false, reason: 'daily_limit', nextState: state };
    }
  }

  const alreadyOpened = new Set(state.openedDripIds.map(String));
  const available = input.drips.filter((drip) => !alreadyOpened.has(String(drip.id)));
  const pool = available.length > 0 ? available : input.drips;
  const drip = pool[Math.floor(Math.random() * pool.length)];
  const isPrimary = !state.primaryDripId;

  return {
    ok: true,
    drip,
    isPrimary,
    nextState: {
      ...state,
      primaryDripId: state.primaryDripId ?? drip.id,
      extraDripsOpened: isPrimary ? state.extraDripsOpened : state.extraDripsOpened + 1,
      openedDripIds: [drip.id, ...state.openedDripIds],
    },
  };
}
