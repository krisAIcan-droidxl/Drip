// Product rules from the PRD (section 8, F3). Mirrors what a Supabase
// `daily_usage` row + RevenueCat entitlement check would enforce server-side.
export const FREE_DAILY_DRIP_LIMIT = 10;
export const FREE_FAVORITES_LIMIT = 10;

export function canRequestDrip(isPremium: boolean, drinksUsedToday: number): boolean {
  return isPremium || drinksUsedToday < FREE_DAILY_DRIP_LIMIT;
}

export function canAddFavorite(isPremium: boolean, currentFavoriteCount: number): boolean {
  return isPremium || currentFavoriteCount < FREE_FAVORITES_LIMIT;
}

export function canViewFullHistory(isPremium: boolean): boolean {
  return isPremium;
}

export const FREE_HISTORY_PREVIEW_COUNT = 3;
