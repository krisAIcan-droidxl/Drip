import type { HistoryEntry } from '@/src/features/drip/dripTypes';
import { getCurrentSession } from '@/src/services/supabase/auth';
import { getSupabaseClient } from '@/src/services/supabase/client';
import {
  dripsRepository,
  favoritesRepository,
  historyRepository,
  streaksRepository,
} from '@/src/services/supabase/repositories';

export interface LocalDripStateSnapshot {
  favIds: number[];
  history: HistoryEntry[];
  streak: number;
  lastActiveDateKey: string | null;
}

export interface SyncSummary {
  status: 'not_configured' | 'signed_out' | 'synced' | 'error';
  historyUploaded: number;
  favoritesSynced: number;
  missingDripIds: number[];
  error?: string;
}

export interface RemoteDripStateSnapshot {
  favIds: number[];
  history: HistoryEntry[];
  streak: number;
  lastActiveDateKey: string | null;
}

export interface RestoreSummary {
  status: 'not_configured' | 'signed_out' | 'restored' | 'error';
  remoteHistoryCount: number;
  remoteFavoriteCount: number;
  error?: string;
}

function uniqueNumbers(values: number[]): number[] {
  return [...new Set(values.filter((value) => Number.isFinite(value)))];
}

export async function syncLocalDripStateToSupabase(snapshot: LocalDripStateSnapshot): Promise<SyncSummary> {
  if (!getSupabaseClient()) {
    return { status: 'not_configured', historyUploaded: 0, favoritesSynced: 0, missingDripIds: [] };
  }

  try {
    const session = await getCurrentSession();
    if (!session.user) {
      return { status: 'signed_out', historyUploaded: 0, favoritesSynced: 0, missingDripIds: [] };
    }

    const localDripIds = uniqueNumbers([
      ...snapshot.favIds,
      ...snapshot.history.map((entry) => entry.dripId),
    ]);
    const idMap = await dripsRepository.mapLocalIds(localDripIds);
    const missingDripIds = localDripIds.filter((id) => !idMap.has(id));

    const remoteFavoriteIds = snapshot.favIds
      .map((id) => idMap.get(id))
      .filter((id): id is string => Boolean(id));

    await favoritesRepository.replaceLocalFavorites(session.user.id, remoteFavoriteIds);

    const historyItems = snapshot.history
      .map((entry) => {
        const remoteDripId = idMap.get(entry.dripId);
        if (!remoteDripId) return null;
        return {
          localEntryId: entry.entryId,
          remoteDripId,
          openedAt: new Date(entry.timestamp).toISOString(),
        };
      })
      .filter((item): item is { localEntryId: string; remoteDripId: string; openedAt: string } => Boolean(item));

    await historyRepository.upsertLocalHistoryItems(session.user.id, historyItems);

    await streaksRepository.upsertStreak({
      userId: session.user.id,
      currentStreak: snapshot.streak,
      lastOpenedDate: snapshot.lastActiveDateKey,
    });

    return {
      status: 'synced',
      historyUploaded: historyItems.length,
      favoritesSynced: remoteFavoriteIds.length,
      missingDripIds,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown sync error.';
    if (__DEV__) console.warn('[supabase] local state sync failed', message);
    return {
      status: 'error',
      historyUploaded: 0,
      favoritesSynced: 0,
      missingDripIds: [],
      error: message,
    };
  }
}

function mergeHistory(local: HistoryEntry[], remote: HistoryEntry[]): HistoryEntry[] {
  const byEntryId = new Map<string, HistoryEntry>();
  for (const entry of [...remote, ...local]) {
    byEntryId.set(entry.entryId, entry);
  }
  return [...byEntryId.values()].sort((a, b) => b.timestamp - a.timestamp);
}

function mergeFavoriteIds(local: number[], remote: number[]): number[] {
  return [...new Set([...local, ...remote])];
}

export async function restoreSupabaseDripState(
  local: LocalDripStateSnapshot
): Promise<{ summary: RestoreSummary; state?: RemoteDripStateSnapshot }> {
  if (!getSupabaseClient()) {
    return {
      summary: { status: 'not_configured', remoteHistoryCount: 0, remoteFavoriteCount: 0 },
    };
  }

  try {
    const session = await getCurrentSession();
    if (!session.user) {
      return {
        summary: { status: 'signed_out', remoteHistoryCount: 0, remoteFavoriteCount: 0 },
      };
    }

    const [remoteHistory, remoteFavoriteIds, remoteStreak] = await Promise.all([
      historyRepository.listLocalHistory(session.user.id),
      favoritesRepository.listLocalFavoriteIds(session.user.id),
      streaksRepository.getStreak(session.user.id),
    ]);

    const mergedHistory = mergeHistory(local.history, remoteHistory);
    const mergedFavoriteIds = mergeFavoriteIds(local.favIds, remoteFavoriteIds);
    const remoteStreakValue = remoteStreak?.currentStreak ?? 0;

    return {
      summary: {
        status: 'restored',
        remoteHistoryCount: remoteHistory.length,
        remoteFavoriteCount: remoteFavoriteIds.length,
      },
      state: {
        favIds: mergedFavoriteIds,
        history: mergedHistory,
        streak: Math.max(local.streak, remoteStreakValue),
        lastActiveDateKey: local.lastActiveDateKey ?? remoteStreak?.lastOpenedDate ?? null,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown restore error.';
    if (__DEV__) console.warn('[supabase] remote state restore failed', message);
    return {
      summary: {
        status: 'error',
        remoteHistoryCount: 0,
        remoteFavoriteCount: 0,
        error: message,
      },
    };
  }
}
