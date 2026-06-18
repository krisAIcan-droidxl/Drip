import type { Drip, DripHistoryItem } from '@/src/types/domain';

export function createHistoryItem(drip: Drip, userId?: string, now: Date = new Date()): DripHistoryItem {
  return {
    id: `${now.getTime()}-${drip.id}`,
    userId,
    dripId: drip.id,
    category: drip.category,
    openedAt: now.toISOString(),
  };
}

export function prependHistory(history: DripHistoryItem[], item: DripHistoryItem, maxItems = 250): DripHistoryItem[] {
  return [item, ...history].slice(0, maxItems);
}
