import type { AnalyticsEvent, AnalyticsEventName } from '@/src/types/domain';

export interface AnalyticsProvider {
  track(event: AnalyticsEvent): Promise<void> | void;
}

class ConsoleAnalyticsProvider implements AnalyticsProvider {
  track(event: AnalyticsEvent): void {
    if (__DEV__) {
      console.log('[analytics]', event.name, event.properties ?? {});
    }
  }
}

let provider: AnalyticsProvider = new ConsoleAnalyticsProvider();

export function setAnalyticsProvider(nextProvider: AnalyticsProvider): void {
  provider = nextProvider;
}

export function trackAnalyticsEvent(
  name: AnalyticsEventName,
  properties?: AnalyticsEvent['properties']
): void {
  provider.track({
    name,
    properties,
    timestamp: new Date().toISOString(),
  });
}

export const AnalyticsEvents = {
  appOpened: () => trackAnalyticsEvent('app_opened'),
  onboardingCompleted: () => trackAnalyticsEvent('onboarding_completed'),
  dripOpened: (category: string) => trackAnalyticsEvent('drip_opened', { category }),
  dripSaved: (category: string) => trackAnalyticsEvent('drip_saved', { category }),
  dripShared: (category: string) => trackAnalyticsEvent('drip_shared', { category }),
  premiumViewed: (trigger?: string) => trackAnalyticsEvent('premium_viewed', { trigger: trigger ?? null }),
  paywallStarted: (trigger?: string) => trackAnalyticsEvent('paywall_started', { trigger: trigger ?? null }),
  subscriptionStarted: (plan: string) => trackAnalyticsEvent('subscription_started', { plan }),
  subscriptionCancelled: (plan: string) => trackAnalyticsEvent('subscription_cancelled', { plan }),
};
