import type { FavoriteDrip, PremiumEntitlement } from '@/src/types/domain';
import { canSaveFavorite } from '@/src/features/premium/limits';

export function toggleFavorite(
  favorites: FavoriteDrip[],
  dripId: string | number,
  entitlement: PremiumEntitlement,
  now: Date = new Date()
): { ok: true; favorites: FavoriteDrip[]; saved: boolean } | { ok: false; reason: 'favorite_limit'; favorites: FavoriteDrip[] } {
  const id = String(dripId);
  const exists = favorites.some((favorite) => String(favorite.dripId) === id);
  if (exists) {
    return {
      ok: true,
      saved: false,
      favorites: favorites.filter((favorite) => String(favorite.dripId) !== id),
    };
  }

  if (!canSaveFavorite(entitlement, favorites.length)) {
    return { ok: false, reason: 'favorite_limit', favorites };
  }

  return {
    ok: true,
    saved: true,
    favorites: [
      {
        id: `${now.getTime()}-${id}`,
        dripId,
        createdAt: now.toISOString(),
      },
      ...favorites,
    ],
  };
}
