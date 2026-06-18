// Stand-in for a real RevenueCat integration. Shaped like the real SDK
// (purchasePackage / restorePurchases resolving to an entitlement result)
// so swapping in `react-native-purchases` later only touches this file.
export type PlanId = 'monthly' | 'yearly';

export interface PurchaseResult {
  success: boolean;
  isPremium: boolean;
}

export async function purchasePackage(plan: PlanId): Promise<PurchaseResult> {
  await new Promise((r) => setTimeout(r, 900));
  return { success: true, isPremium: true };
}

export interface RestoreResult {
  isPremium: boolean;
}

export async function restorePurchases(): Promise<RestoreResult> {
  await new Promise((r) => setTimeout(r, 700));
  return { isPremium: false };
}
