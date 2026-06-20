import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { trackEvent } from '@/src/features/analytics/events';
import {
  canAddFavorite,
  canRequestDrip,
  canViewFullHistory,
} from '@/src/features/monetization/entitlements';
import { purchasePackage, restorePurchases, type PlanId } from '@/src/features/monetization/revenueCat';
import { resolvePremiumEntitlement, subscriptionPlanToLegacyPlan } from '@/src/services/premium/entitlements';
import { syncLocalDripStateToSupabase } from '@/src/services/supabase/sync';
import { ALL_DRIPS, drawNextDripId, getDripById, isYesterday, todayKey } from './dripService';
import type { Drip, HistoryEntry } from './dripTypes';

interface DripState {
  hasHydrated: boolean;
  onboarded: boolean;
  isPremium: boolean;
  plan: PlanId;

  favIds: number[];
  history: HistoryEntry[];
  completedChallengeIds: number[];

  totalOpened: number;
  streak: number;
  lastActiveDateKey: string | null;

  dailyUsageDateKey: string | null;
  dailyUsageCount: number;

  drawQueue: number[];
  currentDripId: number | null;

  setHasHydrated: (v: boolean) => void;
  mergeRemoteState: (state: {
    favIds: number[];
    history: HistoryEntry[];
    streak: number;
    lastActiveDateKey: string | null;
  }) => void;
  finishOnboarding: () => void;
  requestDrip: () => { ok: true; drip: Drip } | { ok: false; reason: 'quota' };
  toggleFavorite: (id: number) => boolean;
  toggleChallengeDone: (id: number) => void;
  selectPlan: (plan: PlanId) => void;
  subscribe: () => Promise<boolean>;
  restore: () => Promise<boolean>;
  refreshPremiumEntitlement: () => Promise<boolean>;

  currentDrip: () => Drip | undefined;
  favoriteDrips: () => Drip[];
  todaysUsage: () => number;
}

function queueSupabaseSync(state: Pick<DripState, 'favIds' | 'history' | 'streak' | 'lastActiveDateKey'>) {
  void syncLocalDripStateToSupabase({
    favIds: state.favIds,
    history: state.history,
    streak: state.streak,
    lastActiveDateKey: state.lastActiveDateKey,
  });
}

export const useDrip = create<DripState>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      onboarded: false,
      isPremium: false,
      plan: 'yearly',

      favIds: [],
      history: [],
      completedChallengeIds: [],

      totalOpened: 0,
      streak: 0,
      lastActiveDateKey: null,

      dailyUsageDateKey: null,
      dailyUsageCount: 0,

      drawQueue: [],
      currentDripId: null,

      setHasHydrated: (v) => set({ hasHydrated: v }),

      mergeRemoteState: (remote) => {
        set({
          favIds: remote.favIds,
          history: remote.history,
          streak: remote.streak,
          lastActiveDateKey: remote.lastActiveDateKey,
          totalOpened: Math.max(get().totalOpened, remote.history.length),
        });
      },

      finishOnboarding: () => set({ onboarded: true }),

      requestDrip: () => {
        const s = get();
        const today = todayKey();
        const usedToday = s.dailyUsageDateKey === today ? s.dailyUsageCount : 0;

        trackEvent('drip_requested');
        if (!canRequestDrip(s.isPremium, usedToday)) {
          trackEvent('paywall_viewed', { trigger: 'daily_limit' });
          return { ok: false, reason: 'quota' };
        }

        const { dripId, queue } = drawNextDripId(s.drawQueue, s.currentDripId);
        const drip = getDripById(dripId)!;

        const streakBroken = s.lastActiveDateKey !== today;
        const nextStreak = !streakBroken
          ? s.streak
          : s.lastActiveDateKey && isYesterday(s.lastActiveDateKey, new Date())
            ? s.streak + 1
            : 1;

        const entry: HistoryEntry = {
          entryId: `${Date.now()}-${dripId}`,
          dripId,
          timestamp: Date.now(),
        };

        set({
          drawQueue: queue,
          currentDripId: dripId,
          dailyUsageDateKey: today,
          dailyUsageCount: usedToday + 1,
          totalOpened: s.totalOpened + 1,
          streak: nextStreak,
          lastActiveDateKey: today,
          history: [entry, ...s.history],
        });

        trackEvent('drip_viewed', { category: drip.category });
        queueSupabaseSync(get());
        return { ok: true, drip };
      },

      toggleFavorite: (id) => {
        const s = get();
        const has = s.favIds.includes(id);
        if (has) {
          set({ favIds: s.favIds.filter((x) => x !== id) });
          trackEvent('drip_unfavorited', { dripId: id });
          queueSupabaseSync(get());
          return true;
        }
        if (!canAddFavorite(s.isPremium, s.favIds.length)) {
          return false;
        }
        set({ favIds: [id, ...s.favIds] });
        trackEvent('drip_favorited', { dripId: id });
        queueSupabaseSync(get());
        return true;
      },

      toggleChallengeDone: (id) => {
        const s = get();
        const has = s.completedChallengeIds.includes(id);
        set({
          completedChallengeIds: has
            ? s.completedChallengeIds.filter((x) => x !== id)
            : [id, ...s.completedChallengeIds],
        });
        if (!has) trackEvent('challenge_completed', { dripId: id });
      },

      selectPlan: (plan) => set({ plan }),

      subscribe: async () => {
        const s = get();
        trackEvent('purchase_started', { plan: s.plan });
        const result = await purchasePackage(s.plan);
        if (result.success) {
          set({ isPremium: result.isPremium });
          void get().refreshPremiumEntitlement();
          trackEvent('purchase_completed', { plan: s.plan });
        }
        return result.success;
      },

      restore: async () => {
        const result = await restorePurchases();
        set({ isPremium: result.isPremium });
        void get().refreshPremiumEntitlement();
        return result.isPremium;
      },

      refreshPremiumEntitlement: async () => {
        const result = await resolvePremiumEntitlement();
        const entitlement = result.entitlement;
        set({
          isPremium: entitlement.isPremium,
          plan: subscriptionPlanToLegacyPlan(entitlement.plan),
        });
        return entitlement.isPremium;
      },

      currentDrip: () => {
        const id = get().currentDripId;
        return id != null ? getDripById(id) : undefined;
      },
      favoriteDrips: () => {
        const ids = get().favIds;
        return ids.map((id) => getDripById(id)).filter((d): d is Drip => !!d);
      },
      todaysUsage: () => {
        const s = get();
        return s.dailyUsageDateKey === todayKey() ? s.dailyUsageCount : 0;
      },
    }),
    {
      name: 'drip-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export function canViewFullHistoryNow(): boolean {
  return canViewFullHistory(useDrip.getState().isPremium);
}

export { ALL_DRIPS };
