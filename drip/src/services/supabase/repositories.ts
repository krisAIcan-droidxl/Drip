import { requireSupabaseClient } from '@/src/services/supabase/client';
import type {
  Drip,
  DripCategory,
  DripHistoryItem,
  FavoriteDrip,
  PremiumEntitlement,
  Profile,
  SubscriptionPlan,
} from '@/src/types/domain';

type DripCategorySlug =
  | 'happy'
  | 'grateful'
  | 'wise'
  | 'challenge'
  | 'curious'
  | 'deep'
  | 'action'
  | 'quote'
  | 'reflection'
  | 'question'
  | 'fact'
  | 'insight';

interface SupabaseDripRow {
  id: string;
  local_id?: number | null;
  body: string;
  author: string | null;
  source: 'curated' | 'ai';
  is_premium: boolean;
  drip_categories: { slug: DripCategorySlug } | { slug: DripCategorySlug }[] | null;
}

interface DripIdMapRow {
  id: string;
  local_id: number;
}

interface SupabaseHistoryRow {
  id: string;
  user_id: string;
  drip_id: string;
  opened_at: string;
  local_entry_id?: string | null;
  drips: {
    local_id?: number | null;
    drip_categories: { slug: DripCategorySlug } | { slug: DripCategorySlug }[] | null;
  } | {
    local_id?: number | null;
    drip_categories: { slug: DripCategorySlug } | { slug: DripCategorySlug }[] | null;
  }[] | null;
}

interface SupabaseFavoriteRow {
  id: string;
  user_id: string;
  drip_id: string;
  created_at: string;
  drips: { local_id?: number | null } | { local_id?: number | null }[] | null;
}

interface SupabaseStreakRow {
  current_streak: number;
  longest_streak: number;
  last_opened_date: string | null;
}

function categoryFromSlug(slug?: string): DripCategory {
  switch (slug) {
    case 'happy':
      return 'HAPPY';
    case 'grateful':
      return 'GRATEFUL';
    case 'challenge':
      return 'CHALLENGE';
    case 'quote':
      return 'QUOTE';
    case 'reflection':
      return 'REFLECTION';
    case 'question':
      return 'QUESTION';
    case 'fact':
      return 'FACT';
    case 'insight':
      return 'INSIGHT';
    case 'curious':
      return 'CURIOUS';
    case 'deep':
      return 'DEEP';
    case 'action':
      return 'ACTION';
    case 'wise':
    default:
      return 'WISE';
  }
}

function categorySlug(row: SupabaseDripRow): string | undefined {
  if (Array.isArray(row.drip_categories)) return row.drip_categories[0]?.slug;
  return row.drip_categories?.slug;
}

function mapDrip(row: SupabaseDripRow): Drip {
  return {
    id: row.id,
    category: categoryFromSlug(categorySlug(row)),
    text: row.body,
    author: row.author ?? undefined,
    isPremium: row.is_premium,
    source: row.source,
  };
}

export const profilesRepository = {
  async getProfile(userId: string): Promise<Profile | null> {
    const supabase = requireSupabaseClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, display_name, avatar_url, timezone, created_at, updated_at')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return {
      userId: data.user_id,
      displayName: data.display_name ?? undefined,
      avatarUrl: data.avatar_url ?? undefined,
      timezone: data.timezone ?? undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async upsertProfile(profile: Profile): Promise<Profile> {
    const supabase = requireSupabaseClient();
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        user_id: profile.userId,
        display_name: profile.displayName ?? null,
        avatar_url: profile.avatarUrl ?? null,
        timezone: profile.timezone ?? null,
        updated_at: new Date().toISOString(),
      })
      .select('user_id, display_name, avatar_url, timezone, created_at, updated_at')
      .single();
    if (error) throw error;
    return {
      userId: data.user_id,
      displayName: data.display_name ?? undefined,
      avatarUrl: data.avatar_url ?? undefined,
      timezone: data.timezone ?? undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },
};

export const dripsRepository = {
  async listActiveDrips(): Promise<Drip[]> {
    const supabase = requireSupabaseClient();
    const { data, error } = await supabase
      .from('drips')
      .select('id, body, author, source, is_premium, drip_categories(slug)')
      .eq('is_active', true)
      .eq('safety_status', 'approved');
    if (error) throw error;
    return ((data ?? []) as SupabaseDripRow[]).map(mapDrip);
  },

  async mapLocalIds(localIds: number[]): Promise<Map<number, string>> {
    if (localIds.length === 0) return new Map();
    const supabase = requireSupabaseClient();
    const uniqueIds = [...new Set(localIds)];
    const { data, error } = await supabase
      .from('drips')
      .select('id, local_id')
      .in('local_id', uniqueIds);
    if (error) throw error;
    return new Map(
      ((data ?? []) as DripIdMapRow[])
        .filter((row) => row.local_id != null)
        .map((row) => [row.local_id, row.id])
    );
  },
};

export const historyRepository = {
  async listHistory(userId: string): Promise<DripHistoryItem[]> {
    const supabase = requireSupabaseClient();
    const { data, error } = await supabase
      .from('user_drip_history')
      .select('id, user_id, drip_id, opened_at, drips(id, drip_categories(slug))')
      .eq('user_id', userId)
      .order('opened_at', { ascending: false });
    if (error) throw error;

    return ((data ?? []) as SupabaseHistoryRow[]).map((row) => {
      const drip = Array.isArray(row.drips) ? row.drips[0] : row.drips;
      const category = Array.isArray(drip?.drip_categories)
        ? drip?.drip_categories[0]?.slug
        : drip?.drip_categories?.slug;
      return {
        id: row.id,
        userId: row.user_id,
        dripId: row.drip_id,
        openedAt: row.opened_at,
        category: categoryFromSlug(category),
      };
    });
  },

  async listLocalHistory(userId: string): Promise<Array<{ entryId: string; dripId: number; timestamp: number }>> {
    const supabase = requireSupabaseClient();
    const { data, error } = await supabase
      .from('user_drip_history')
      .select('id, local_entry_id, opened_at, drips(local_id)')
      .eq('user_id', userId)
      .order('opened_at', { ascending: false });
    if (error) throw error;

    return ((data ?? []) as SupabaseHistoryRow[])
      .map((row) => {
        const drip = Array.isArray(row.drips) ? row.drips[0] : row.drips;
        const localId = drip?.local_id;
        if (typeof localId !== 'number') return null;
        return {
          entryId: row.local_entry_id ?? row.id,
          dripId: localId,
          timestamp: new Date(row.opened_at).getTime(),
        };
      })
      .filter((row): row is { entryId: string; dripId: number; timestamp: number } => Boolean(row));
  },

  async addHistoryItem(item: DripHistoryItem): Promise<DripHistoryItem> {
    const supabase = requireSupabaseClient();
    const { data, error } = await supabase
      .from('user_drip_history')
      .insert({
        user_id: item.userId,
        drip_id: String(item.dripId),
        opened_at: item.openedAt,
      })
      .select('id, user_id, drip_id, opened_at')
      .single();
    if (error) throw error;
    return {
      ...item,
      id: data.id,
      userId: data.user_id,
      dripId: data.drip_id,
      openedAt: data.opened_at,
    };
  },

  async upsertLocalHistoryItems(
    userId: string,
    items: Array<{ localEntryId: string; remoteDripId: string; openedAt: string; isPrimaryDaily?: boolean }>
  ): Promise<void> {
    if (items.length === 0) return;
    const supabase = requireSupabaseClient();
    const { error } = await supabase
      .from('user_drip_history')
      .upsert(
        items.map((item) => ({
          user_id: userId,
          drip_id: item.remoteDripId,
          opened_at: item.openedAt,
          date_key: item.openedAt.slice(0, 10),
          local_entry_id: item.localEntryId,
          is_primary_daily: item.isPrimaryDaily ?? false,
        })),
        { onConflict: 'user_id,local_entry_id', ignoreDuplicates: true }
      );
    if (error) throw error;
  },
};

export const favoritesRepository = {
  async listFavorites(userId: string): Promise<FavoriteDrip[]> {
    const supabase = requireSupabaseClient();
    const { data, error } = await supabase
      .from('user_favorites')
      .select('id, user_id, drip_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => ({
      id: row.id,
      userId: row.user_id,
      dripId: row.drip_id,
      createdAt: row.created_at,
    }));
  },

  async listLocalFavoriteIds(userId: string): Promise<number[]> {
    const supabase = requireSupabaseClient();
    const { data, error } = await supabase
      .from('user_favorites')
      .select('drips(local_id)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;

    return ((data ?? []) as SupabaseFavoriteRow[])
      .map((row) => {
        const drip = Array.isArray(row.drips) ? row.drips[0] : row.drips;
        return drip?.local_id;
      })
      .filter((id): id is number => typeof id === 'number');
  },

  async addFavorite(favorite: FavoriteDrip): Promise<FavoriteDrip> {
    const supabase = requireSupabaseClient();
    const { data, error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: favorite.userId,
        drip_id: String(favorite.dripId),
        created_at: favorite.createdAt,
      })
      .select('id, user_id, drip_id, created_at')
      .single();
    if (error) throw error;
    return {
      id: data.id,
      userId: data.user_id,
      dripId: data.drip_id,
      createdAt: data.created_at,
    };
  },

  async removeFavorite(userId: string, dripId: string | number): Promise<void> {
    const supabase = requireSupabaseClient();
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('drip_id', String(dripId));
    if (error) throw error;
  },

  async upsertLocalFavorites(userId: string, remoteDripIds: string[]): Promise<void> {
    if (remoteDripIds.length === 0) return;
    const supabase = requireSupabaseClient();
    const { error } = await supabase
      .from('user_favorites')
      .upsert(
        [...new Set(remoteDripIds)].map((dripId) => ({
          user_id: userId,
          drip_id: dripId,
        })),
        { onConflict: 'user_id,drip_id', ignoreDuplicates: true }
      );
    if (error) throw error;
  },

  async replaceLocalFavorites(userId: string, keepRemoteDripIds: string[]): Promise<void> {
    const supabase = requireSupabaseClient();

    const { data, error: listError } = await supabase
      .from('user_favorites')
      .select('drip_id')
      .eq('user_id', userId);
    if (listError) throw listError;

    const keep = new Set(keepRemoteDripIds);
    const stale = (data ?? [])
      .map((row) => row.drip_id)
      .filter((dripId): dripId is string => typeof dripId === 'string' && !keep.has(dripId));

    if (stale.length > 0) {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId)
        .in('drip_id', stale);
      if (error) throw error;
    }

    await favoritesRepository.upsertLocalFavorites(userId, keepRemoteDripIds);
  },
};

export const streaksRepository = {
  async getStreak(userId: string): Promise<{ currentStreak: number; lastOpenedDate: string | null } | null> {
    const supabase = requireSupabaseClient();
    const { data, error } = await supabase
      .from('user_streaks')
      .select('current_streak, longest_streak, last_opened_date')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const row = data as SupabaseStreakRow;
    return {
      currentStreak: row.current_streak,
      lastOpenedDate: row.last_opened_date,
    };
  },

  async upsertStreak(input: {
    userId: string;
    currentStreak: number;
    lastOpenedDate: string | null;
  }): Promise<void> {
    const supabase = requireSupabaseClient();
    const { data: existing, error: readError } = await supabase
      .from('user_streaks')
      .select('longest_streak')
      .eq('user_id', input.userId)
      .maybeSingle();
    if (readError) throw readError;

    const { error } = await supabase
      .from('user_streaks')
      .upsert({
        user_id: input.userId,
        current_streak: input.currentStreak,
        longest_streak: Math.max(existing?.longest_streak ?? 0, input.currentStreak),
        last_opened_date: input.lastOpenedDate,
        updated_at: new Date().toISOString(),
      });
    if (error) throw error;
  },
};

export const premiumRepository = {
  async getEntitlement(userId: string): Promise<PremiumEntitlement> {
    const supabase = requireSupabaseClient();
    const { data, error } = await supabase
      .from('subscriptions')
      .select('plan, status, current_period_end')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;

    const plan = (data?.plan ?? 'free') as SubscriptionPlan;
    const active = data?.status === 'active' || data?.status === 'trialing';
    return {
      isPremium: active && plan !== 'free',
      plan,
      expiresAt: data?.current_period_end ?? null,
      source: 'supabase',
    };
  },
};
