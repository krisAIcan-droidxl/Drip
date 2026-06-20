import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type RevenueCatEventType =
  | 'TEST'
  | 'INITIAL_PURCHASE'
  | 'RENEWAL'
  | 'CANCELLATION'
  | 'UNCANCELLATION'
  | 'NON_RENEWING_PURCHASE'
  | 'SUBSCRIPTION_PAUSED'
  | 'EXPIRATION'
  | 'BILLING_ISSUE'
  | 'PRODUCT_CHANGE'
  | 'TRANSFER'
  | 'SUBSCRIPTION_EXTENDED'
  | 'TEMPORARY_ENTITLEMENT_GRANT'
  | 'REFUND_REVERSED'
  | 'PURCHASE_REDEEMED';

type SubscriptionStatus = 'inactive' | 'trialing' | 'active' | 'cancelled' | 'expired';
type SubscriptionPlan = 'free' | 'premium_monthly' | 'premium_yearly' | 'lifetime';

interface RevenueCatWebhookPayload {
  api_version?: string;
  event?: {
    type?: RevenueCatEventType;
    id?: string;
    app_user_id?: string;
    original_app_user_id?: string;
    aliases?: string[];
    transferred_to?: string[];
    product_id?: string;
    entitlement_id?: string | null;
    entitlement_ids?: string[] | null;
    expiration_at_ms?: number | null;
    grace_period_expiration_at_ms?: number | null;
    period_type?: string | null;
  };
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function isAuthorized(request: Request): boolean {
  const secret = Deno.env.get('REVENUECAT_WEBHOOK_SECRET');
  if (!secret) return false;

  const authorization = request.headers.get('authorization') ?? '';
  return authorization === secret || authorization === `Bearer ${secret}`;
}

function isUuid(value: string | undefined): value is string {
  return Boolean(
    value?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
  );
}

function isoFromMillis(value: number | null | undefined): string | null {
  return typeof value === 'number' ? new Date(value).toISOString() : null;
}

function planFromProductId(productId: string | undefined): SubscriptionPlan {
  const normalized = productId?.toLowerCase() ?? '';
  if (normalized.includes('lifetime')) return 'lifetime';
  if (normalized.includes('month')) return 'premium_monthly';
  if (normalized.includes('year') || normalized.includes('annual')) return 'premium_yearly';
  return 'premium_yearly';
}

function statusFromEvent(event: NonNullable<RevenueCatWebhookPayload['event']>): SubscriptionStatus {
  const now = Date.now();
  const expiresAt = event.expiration_at_ms ?? null;
  const graceExpiresAt = event.grace_period_expiration_at_ms ?? null;
  const hasFutureAccess = expiresAt === null || (typeof expiresAt === 'number' && expiresAt > now);
  const inGracePeriod = typeof graceExpiresAt === 'number' && graceExpiresAt > now;

  if (event.type === 'EXPIRATION') return 'expired';
  if (event.type === 'SUBSCRIPTION_PAUSED') return hasFutureAccess ? 'active' : 'expired';
  if (event.type === 'BILLING_ISSUE') return inGracePeriod || hasFutureAccess ? 'active' : 'expired';
  if (event.type === 'CANCELLATION') return hasFutureAccess ? 'active' : 'cancelled';
  if (event.period_type === 'TRIAL') return 'trialing';

  return 'active';
}

function userIdFromEvent(event: NonNullable<RevenueCatWebhookPayload['event']>): string | undefined {
  if (isUuid(event.app_user_id)) return event.app_user_id;
  if (isUuid(event.original_app_user_id)) return event.original_app_user_id;
  return event.aliases?.find(isUuid) ?? event.transferred_to?.find(isUuid);
}

Deno.serve(async (request) => {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  if (!isAuthorized(request)) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const payload = (await request.json()) as RevenueCatWebhookPayload;
  const event = payload.event;
  if (!event?.type) {
    return jsonResponse({ error: 'Invalid RevenueCat payload' }, 400);
  }

  if (event.type === 'TEST') {
    return jsonResponse({ ok: true, ignored: 'test_event' });
  }

  const userId = userIdFromEvent(event);
  if (!userId) {
    return jsonResponse({ ok: true, ignored: 'no_supabase_user_id' }, 202);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: 'Missing Supabase server env' }, 500);
  }

  const entitlement =
    event.entitlement_ids?.[0] ??
    event.entitlement_id ??
    Deno.env.get('REVENUECAT_ENTITLEMENT_ID') ??
    'premium';

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { error } = await supabase.from('subscriptions').upsert({
    user_id: userId,
    revenuecat_customer_id: event.app_user_id ?? event.original_app_user_id ?? userId,
    plan: event.type === 'EXPIRATION' ? 'free' : planFromProductId(event.product_id),
    status: statusFromEvent(event),
    entitlement,
    current_period_end: isoFromMillis(event.expiration_at_ms),
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error('[revenuecat-webhook] subscription upsert failed', error);
    return jsonResponse({ error: 'Subscription update failed' }, 500);
  }

  return jsonResponse({ ok: true });
});
