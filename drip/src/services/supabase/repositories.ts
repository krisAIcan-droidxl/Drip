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

type DripCategorySlug = 'happy' | 'grateful' | 'wise' | 'challenge' | 'curious' | 'deep' | 'action';

interface SupabaseDripRow {
  id: string;
  body: string;
  author: string | null;
  source: 'curated' | 'ai';
  is_premium: boolean;
  drip_categories: { slug: DripCategorySlug } | { slug: DripCategorySlug }[] | null;
}

interface SupabaseHistoryRow {
  id: string;
  user_id: string;
  drip_id: string;
  opened_at: string;
  drips: {
    drip_categories: { slug: DripCategorySlug } | { slug: DripCategorySlug }[] | null;
  } | {
    drip_categories: { slug: DripCategorySlug } | { slug: DripCategorySlug }[] | null;
  }[] | null;
}

function categoryFromSlug(slug?: string): DripCategory {
  switch (slug) {
    case 'happy':
      return 'HAPPY';
    case 'grateful':
      return 'GRATEFUL';
    case 'challenge':
      return 'CHALLENGE';
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
