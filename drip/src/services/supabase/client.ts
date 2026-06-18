import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { appConfig, hasSupabaseConfig } from '@/src/config/env';
import { AppError } from '@/src/security/safeErrors';

export interface SupabaseClientStatus {
  configured: boolean;
  url?: string;
}

export function getSupabaseStatus(): SupabaseClientStatus {
  return {
    configured: hasSupabaseConfig(),
    url: appConfig.supabaseUrl,
  };
}

function createSupabaseClient(): SupabaseClient | null {
  if (!appConfig.supabaseUrl || !appConfig.supabaseAnonKey) {
    return null;
  }

  return createClient(appConfig.supabaseUrl, appConfig.supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}

export const supabaseClient = createSupabaseClient();

export function getSupabaseClient(): SupabaseClient | null {
  return supabaseClient;
}

export function requireSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    throw new AppError(
      'service_unavailable',
      'Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }
  return supabaseClient;
}

export async function requireSupabaseConfigured(): Promise<void> {
  requireSupabaseClient();
}
