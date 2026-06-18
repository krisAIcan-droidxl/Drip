import type { AppConfig, AppEnvironment } from '@/src/types/domain';

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value : undefined;
}

function appEnvironment(value: string | undefined): AppEnvironment {
  if (value === 'production' || value === 'staging' || value === 'development') return value;
  return 'development';
}

export const appConfig: AppConfig = {
  env: appEnvironment(readEnv('EXPO_PUBLIC_APP_ENV')),
  supabaseUrl: readEnv('EXPO_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: readEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY'),
  revenueCatApiKeyIos: readEnv('EXPO_PUBLIC_REVENUECAT_API_KEY_IOS'),
  revenueCatApiKeyAndroid: readEnv('EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID'),
  openAiProxyUrl: readEnv('EXPO_PUBLIC_OPENAI_PROXY_URL'),
  analyticsProvider: readEnv('EXPO_PUBLIC_ANALYTICS_PROVIDER'),
};

export function hasSupabaseConfig(config: AppConfig = appConfig): boolean {
  return Boolean(config.supabaseUrl && config.supabaseAnonKey);
}

export function hasOpenAiProxy(config: AppConfig = appConfig): boolean {
  return Boolean(config.openAiProxyUrl);
}
