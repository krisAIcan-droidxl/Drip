import { getCurrentSession } from '@/src/services/supabase/auth';
import { getSupabaseClient } from '@/src/services/supabase/client';
import { premiumRepository } from '@/src/services/supabase/repositories';
import { revenueCatService } from '@/src/services/revenuecat';
import type { PremiumEntitlement, SubscriptionPlan } from '@/src/types/domain';

export interface PremiumEntitlementResult {
  status: 'not_configured' | 'signed_out' | 'resolved' | 'error';
  entitlement: PremiumEntitlement;
  error?: string;
}

const freeEntitlement: PremiumEntitlement = {
  isPremium: false,
  plan: 'free',
  expiresAt: null,
  source: 'mock',
};

export function subscriptionPlanToLegacyPlan(plan: SubscriptionPlan): 'monthly' | 'yearly' {
  if (plan === 'premium_monthly') return 'monthly';
  return 'yearly';
}

export async function resolvePremiumEntitlement(): Promise<PremiumEntitlementResult> {
  try {
    if (getSupabaseClient()) {
      const session = await getCurrentSession();
      if (!session.user) {
        return { status: 'signed_out', entitlement: freeEntitlement };
      }

      const entitlement = await premiumRepository.getEntitlement(session.user.id);
      if (entitlement.isPremium) {
        return { status: 'resolved', entitlement };
      }
    }

    const revenueCatEntitlement = await revenueCatService.getEntitlement();
    return {
      status: getSupabaseClient() ? 'resolved' : 'not_configured',
      entitlement: revenueCatEntitlement,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to resolve premium entitlement.';
    if (__DEV__) console.warn('[premium] entitlement resolve failed', message);
    return {
      status: 'error',
      entitlement: freeEntitlement,
      error: message,
    };
  }
}
