# Drip Security Notes

## Principles

- Do not hardcode secrets in the mobile app.
- Treat Expo public env vars as public.
- Keep OpenAI calls behind a server-side proxy or Supabase Edge Function.
- Enforce paid limits server-side, not only in local state.
- Store the minimum user data needed.
- Avoid logging raw drip text, user prompts, emails, or identifiers unless strictly required.

## Environment

Use `.env` locally and `.env.example` as documentation. Only `EXPO_PUBLIC_*` values are safe to expose to the client. Do not put service-role keys, OpenAI API keys, RevenueCat webhook secrets, or database admin credentials in the app bundle.

## Supabase

Use Supabase Auth for users and Row Level Security for user-owned tables. The migration in `supabase/migrations/001_initial_schema.sql` enables RLS and restricts profile, history, favorite, streak, subscription, share, and feedback access to the authenticated user.

Server-only tasks should use Supabase Edge Functions with service-role credentials stored in Supabase function secrets, not in the Expo app.

## OpenAI

The app should call `EXPO_PUBLIC_OPENAI_PROXY_URL`, not OpenAI directly. The proxy should:

- authenticate the user
- verify premium entitlement or free quota
- rate limit by user and IP
- sanitize and constrain prompts
- apply content safety checks
- log only metadata needed for abuse prevention
- return a safe fallback drip when generation fails

## RevenueCat

The client can read customer entitlements for UI decisions, but important premium state should be reconciled through RevenueCat webhooks and stored server-side in `subscriptions`.

## Input Validation

Validate user prompts and feedback before sending them to any service. Current validation helpers reject empty prompts, overly long prompts, and suspicious control characters.

## Error Handling

Use safe user-facing messages. Do not show stack traces, request payloads, tokens, auth IDs, or raw provider responses in production UI.

## Analytics Privacy

Analytics should be event-based and low-cardinality. Prefer:

- event names
- category names
- plan IDs
- boolean flags

Avoid:

- raw drip text
- raw AI prompts
- email addresses
- full names
- exact location
- device identifiers beyond what the analytics SDK already manages

## Storage

AsyncStorage is acceptable for MVP non-secret state: onboarding, preferences, cached history IDs, favorites, and local streaks. Do not store tokens manually, API keys, payment data, or sensitive profile data in AsyncStorage.

## Rate Limits

Recommended production limits:

- Free extra drips: product limit per local day plus server-side quota.
- AI generation: strict per-user rolling window.
- Feedback/share events: soft limit to prevent spam.
- Auth: rely on Supabase protections and add server-side abuse monitoring.

## Remaining Security Work

- Add real auth.
- Add account deletion.
- Add privacy policy and terms.
- Add server-side premium validation.
- Add backend rate limiter.
- Add crash reporting with PII scrubbing.
- Add CI checks for secrets.
