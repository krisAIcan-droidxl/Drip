// Stand-in for Firebase Analytics. Same event vocabulary as the PRD
// (section 7, "Analytics events") so wiring a real SDK later is a one-file change.
export type AnalyticsEvent =
  | 'app_opened'
  | 'drip_requested'
  | 'drip_viewed'
  | 'drip_favorited'
  | 'drip_unfavorited'
  | 'drip_shared'
  | 'challenge_completed'
  | 'paywall_viewed'
  | 'purchase_started'
  | 'purchase_completed';

export function trackEvent(event: AnalyticsEvent, props?: Record<string, unknown>) {
  if (__DEV__) {
    console.log(`[analytics] ${event}`, props ?? {});
  }
}
