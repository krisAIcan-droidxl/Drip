import { appConfig } from '@/src/config/env';
import type { PremiumEntitlement, SubscriptionPlan } from '@/src/types/domain';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  'free',
  'premium_monthly',
  'premium_yearly',
  'lifetime',
];

export interface RevenueCatService {
  configure(): Promise<void>;
  getEntitlement(): Promise<PremiumEntitlement>;
  purchase(plan: Exclude<SubscriptionPlan, 'free'>): Promise<PremiumEntitlement>;
  restore(): Promise<PremiumEntitlement>;
}

const freeEntitlement: PremiumEntitlement = {
  isPremium: false,
  plan: 'free',
  expiresAt: null,
  source: 'mock',
};

class MockRevenueCatService implements RevenueCatService {
  async configure(): Promise<void> {
    if (__DEV__ && !appConfig.revenueCatApiKeyIos && !appConfig.revenueCatApiKeyAndroid) {
      console.log('[revenuecat] mock mode: missing RevenueCat API keys');
    }
  }

  async getEntitlement(): Promise<PremiumEntitlement> {
    return freeEntitlement;
  }

  async purchase(plan: Exclude<SubscriptionPlan, 'free'>): Promise<PremiumEntitlement> {
    return {
      isPremium: true,
      plan,
      expiresAt: plan === 'lifetime' ? null : undefined,
      source: 'mock',
    };
  }

  async restore(): Promise<PremiumEntitlement> {
    return freeEntitlement;
  }
}

export const revenueCatService: RevenueCatService = new MockRevenueCatService();
