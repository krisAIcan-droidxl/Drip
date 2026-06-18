export type AppEnvironment = 'development' | 'staging' | 'production';

export type DripCategory =
  | 'QUOTE'
  | 'CHALLENGE'
  | 'REFLECTION'
  | 'QUESTION'
  | 'FACT'
  | 'INSIGHT'
  | 'HAPPY'
  | 'GRATEFUL'
  | 'WISE'
  | 'CURIOUS'
  | 'DEEP'
  | 'ACTION';

export type DripKind = 'happy' | 'grateful' | 'wise' | 'challenge' | 'curious' | 'deep' | 'action';

export interface User {
  id: string;
  email?: string;
  createdAt: string;
}

export interface Profile {
  userId: string;
  displayName?: string;
  avatarUrl?: string;
  timezone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Drip {
  id: number | string;
  category: DripCategory;
  text: string;
  author?: string;
  isPremium?: boolean;
  source?: 'curated' | 'ai';
  createdAt?: string;
}

export interface DripHistoryItem {
  id: string;
  userId?: string;
  dripId: number | string;
  openedAt: string;
  category: DripCategory;
}

export interface FavoriteDrip {
  id: string;
  userId?: string;
  dripId: number | string;
  createdAt: string;
}

export type SubscriptionPlan = 'free' | 'premium_monthly' | 'premium_yearly' | 'lifetime';

export interface PremiumEntitlement {
  isPremium: boolean;
  plan: SubscriptionPlan;
  expiresAt?: string | null;
  source: 'mock' | 'revenuecat' | 'supabase';
}

export type AnalyticsEventName =
  | 'app_opened'
  | 'onboarding_completed'
  | 'drip_opened'
  | 'drip_saved'
  | 'drip_shared'
  | 'premium_viewed'
  | 'paywall_started'
  | 'subscription_started'
  | 'subscription_cancelled';

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  properties?: Record<string, string | number | boolean | null>;
  timestamp: string;
}

export interface AppConfig {
  env: AppEnvironment;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  revenueCatApiKeyIos?: string;
  revenueCatApiKeyAndroid?: string;
  openAiProxyUrl?: string;
  analyticsProvider?: string;
}

export interface UserPreferences {
  preferredKinds: DripKind[];
  notificationsEnabled: boolean;
}
