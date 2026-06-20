import { revenueCatService } from '@/src/services/revenuecat';

export type PlanId = 'monthly' | 'yearly';

export interface PurchaseResult {
  success: boolean;
  isPremium: boolean;
  error?: string;
}

export async function purchasePackage(plan: PlanId): Promise<PurchaseResult> {
  try {
    const entitlement = await revenueCatService.purchase(plan === 'monthly' ? 'premium_monthly' : 'premium_yearly');
    return { success: entitlement.isPremium, isPremium: entitlement.isPremium };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Purchase failed.';
    if (__DEV__) console.warn('[revenuecat] purchase failed', message);
    return { success: false, isPremium: false, error: message };
  }
}

export interface RestoreResult {
  isPremium: boolean;
  error?: string;
}

export async function restorePurchases(): Promise<RestoreResult> {
  try {
    const entitlement = await revenueCatService.restore();
    return { isPremium: entitlement.isPremium };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Restore failed.';
    if (__DEV__) console.warn('[revenuecat] restore failed', message);
    return { isPremium: false, error: message };
  }
}
