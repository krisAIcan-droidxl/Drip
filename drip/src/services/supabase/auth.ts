import { getSupabaseClient, requireSupabaseClient } from '@/src/services/supabase/client';
import type { User } from '@/src/types/domain';

export interface AuthSession {
  user: User | null;
  accessToken?: string;
}

export type AuthBootstrapResult =
  | { status: 'not_configured' }
  | { status: 'signed_in'; session: AuthSession }
  | { status: 'error'; message: string };

function mapUser(user: { id: string; email?: string; created_at?: string }): User {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.created_at ?? new Date().toISOString(),
  };
}

export async function getCurrentSession(): Promise<AuthSession> {
  const supabase = getSupabaseClient();
  if (!supabase) return { user: null };

  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;

  return {
    user: data.session?.user ? mapUser(data.session.user) : null,
    accessToken: data.session?.access_token,
  };
}

async function upsertUserBootstrapRows(user: User): Promise<void> {
  const supabase = requireSupabaseClient();

  await supabase.from('users').upsert({
    id: user.id,
    email: user.email ?? null,
  });

  await supabase.from('profiles').upsert({
    user_id: user.id,
    updated_at: new Date().toISOString(),
  });

  await supabase.from('user_streaks').upsert({
    user_id: user.id,
  });

  await supabase.from('subscriptions').upsert({
    user_id: user.id,
    plan: 'free',
    status: 'inactive',
  });
}

export async function ensureAnonymousSession(): Promise<AuthSession> {
  const existing = await getCurrentSession();
  if (existing.user) return existing;

  const supabase = requireSupabaseClient();
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;

  const user = data.user ? mapUser(data.user) : null;
  if (user) {
    await upsertUserBootstrapRows(user);
  }

  return {
    user,
    accessToken: data.session?.access_token,
  };
}

export async function bootstrapAuth(): Promise<AuthBootstrapResult> {
  if (!getSupabaseClient()) {
    return { status: 'not_configured' };
  }

  try {
    const session = await ensureAnonymousSession();
    return { status: 'signed_in', session };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Auth bootstrap failed.';
    if (__DEV__) console.warn('[supabase] auth bootstrap failed', message);
    return { status: 'error', message };
  }
}

export async function signOut(): Promise<void> {
  const supabase = requireSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
