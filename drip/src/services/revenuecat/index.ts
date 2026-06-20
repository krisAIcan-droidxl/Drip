import { Platform } from 'react-native';
import type { CustomerInfo, PurchasesOffering, PurchasesPackage } from 'react-native-purchases';

import { appConfig } from '@/src/config/env';
import type { PremiumEntitlement, SubscriptionPlan } from '@/src/types/domain';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  'free',
  'premium_monthly',
  'premium_yearly',
  'lifetime',
];

export interface RevenueCatService {
  configure(appUserId?: string): Promise<void>;
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

function getPlatformApiKey(): string | undefined {
  if (Platform.OS === 'ios') return appConfig.revenueCatApiKeyIos;
  if (Platform.OS === 'android') return appConfig.revenueCatApiKeyAndroid;
  return undefined;
}

function planFromProductIdentifier(productIdentifier: string, expirationDate?: string | null): SubscriptionPlan {
  const normalized = productIdentifier.toLowerCase();
  if (normalized.includes('lifetime')) return 'lifetime';
  if (normalized.includes('month')) return 'premium_monthly';
  if (normalized.includes('year') || normalized.includes('annual')) return 'premium_yearly';
  return expirationDate === null ? 'lifetime' : 'premium_yearly';
}

function entitlementFromCustomerInfo(customerInfo: CustomerInfo): PremiumEntitlement {
  const entitlementId = appConfig.revenueCatEntitlementId ?? 'premium';
  const activeEntitlement =
    customerInfo.entitlements.active[entitlementId] ??
    Object.values(customerInfo.entitlements.active)[0];

  if (!activeEntitlement?.isActive) {
    return {
      ...freeEntitlement,
      source: 'revenuecat',
    };
  }

  return {
    isPremium: true,
    plan: planFromProductIdentifier(activeEntitlement.productIdentifier, activeEntitlement.expirationDate),
    expiresAt: activeEntitlement.expirationDate,
    source: 'revenuecat',
  };
}

function packageMatchesPlan(candidate: PurchasesPackage, plan: Exclude<SubscriptionPlan, 'free'>): boolean {
  const packageType = String(candidate.packageType).toUpperCase();
  const identifier = `${candidate.identifier} ${candidate.product.identifier}`.toLowerCase();

  if (plan === 'premium_monthly') {
    return packageType === 'MONTHLY' || identifier.includes('month');
  }
  if (plan === 'premium_yearly') {
    return packageType === 'ANNUAL' || identifier.includes('year') || identifier.includes('annual');
  }
  return packageType === 'LIFETIME' || identifier.includes('lifetime');
}

function packageForPlan(offering: PurchasesOffering, plan: Exclude<SubscriptionPlan, 'free'>): PurchasesPackage | null {
  if (plan === 'premium_monthly' && offering.monthly) return offering.monthly;
  if (plan === 'premium_yearly' && offering.annual) return offering.annual;
  if (plan === 'lifetime' && offering.lifetime) return offering.lifetime;
  return offering.availablePackages.find((candidate) => packageMatchesPlan(candidate, plan)) ?? null;
}

class NativeRevenueCatService implements RevenueCatService {
  private configured = false;
  private configuredUserId: string | undefined;

  async configure(appUserId?: string): Promise<void> {
    const apiKey = getPlatformApiKey();
    if (!apiKey) {
      if (__DEV__) console.log('[revenuecat] disabled: missing API key for this platform');
      return;
    }

    try {
      const { default: Purchases } = await import('react-native-purchases');
      if (this.configured) {
        if (appUserId && appUserId !== this.configuredUserId) {
          await Purchases.logIn(appUserId);
          this.configuredUserId = appUserId;
        }
        return;
      }

      await Purchases.setLogLevel(__DEV__ ? Purchases.LOG_LEVEL.DEBUG : Purchases.LOG_LEVEL.WARN);
      Purchases.configure({
        apiKey,
        appUserID: appUserId,
      });
      this.configured = true;
      this.configuredUserId = appUserId;
    } catch (error) {
      this.configured = false;
      const message = error instanceof Error ? error.message : 'RevenueCat configure failed.';
      if (__DEV__) console.warn('[revenuecat] configure failed', message);
    }
  }

  private async ensureConfigured(): Promise<boolean> {
    await this.configure(this.configuredUserId);
    return this.configured;
  }

  async getEntitlement(): Promise<PremiumEntitlement> {
    if (!(await this.ensureConfigured())) return { ...freeEntitlement, source: 'revenuecat' };

    const { default: Purchases } = await import('react-native-purchases');
    const customerInfo = await Purchases.getCustomerInfo();
    return entitlementFromCustomerInfo(customerInfo);
  }

  async purchase(plan: Exclude<SubscriptionPlan, 'free'>): Promise<PremiumEntitlement> {
    if (!(await this.ensureConfigured())) {
      throw new Error('RevenueCat is not configured for this platform.');
    }

    const { default: Purchases } = await import('react-native-purchases');
    const offerings = await Purchases.getOfferings();
    const offering = appConfig.revenueCatOfferingId
      ? offerings.all[appConfig.revenueCatOfferingId] ?? offerings.current
      : offerings.current;

    if (!offering) {
      throw new Error('No RevenueCat offering is available.');
    }

    const selectedPackage = packageForPlan(offering, plan);
    if (!selectedPackage) {
      throw new Error(`No RevenueCat package is available for ${plan}.`);
    }

    const result = await Purchases.purchasePackage(selectedPackage);
    return entitlementFromCustomerInfo(result.customerInfo);
  }

  async restore(): Promise<PremiumEntitlement> {
    if (!(await this.ensureConfigured())) return { ...freeEntitlement, source: 'revenuecat' };

    const { default: Purchases } = await import('react-native-purchases');
    const customerInfo = await Purchases.restorePurchases();
    return entitlementFromCustomerInfo(customerInfo);
  }
}

export const revenueCatService: RevenueCatService = new NativeRevenueCatService();
