import { FREE_EXTRA_DRIPS_PER_DAY, FREE_FAVORITES_LIMIT } from '@/src/constants/product';
import type { PremiumEntitlement } from '@/src/types/domain';

export function canUseExtraDrip(entitlement: PremiumEntitlement, extraDripsOpenedToday: number): boolean {
  return entitlement.isPremium || extraDripsOpenedToday < FREE_EXTRA_DRIPS_PER_DAY;
}

export function canSaveFavorite(entitlement: PremiumEntitlement, currentFavoriteCount: number): boolean {
  return entitlement.isPremium || currentFavoriteCount < FREE_FAVORITES_LIMIT;
}

export function canViewFullHistory(entitlement: PremiumEntitlement): boolean {
  return entitlement.isPremium;
}
