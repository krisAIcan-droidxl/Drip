# Drip Backend Plan

## Recommended Path

Start with Supabase. Add serverless functions only when the product needs protected computation.

## Phase 1: Supabase Foundation

- Supabase Auth for anonymous/email/social auth.
- Postgres tables from `supabase/migrations/001_initial_schema.sql`.
- RLS on all user-owned data.
- Curated drips stored in `drips` and categorized through `drip_categories`.
- Client reads public active drips.
- Client writes authenticated history, favorites, streaks, feedback, and share events.

## Phase 2: Monetization

- RevenueCat SDK in the app.
- RevenueCat webhooks to a Supabase Edge Function.
- Edge Function validates webhook signatures.
- Store current user subscription state in `subscriptions`.
- Client can use RevenueCat for UI, but server state is the source of truth for protected features.

## Phase 3: AI Drips

- Supabase Edge Function: `generate-ai-drip`.
- The app sends a constrained intent, not an arbitrary system prompt.
- Function checks auth, premium entitlement, and rate limits.
- Function calls OpenAI with a fixed system prompt and safety guardrails.
- Function writes generated metadata if needed, but avoids storing sensitive raw prompts by default.
- Function falls back to curated drips on failure.

## Phase 4: Notifications

- Expo Notifications for reminders.
- Store user notification preferences.
- Avoid engagement spam; default to opt-in.
- Send daily reminder only if the daily drip is unopened.

## Phase 5: Analytics

- Use Firebase Analytics, PostHog, or Amplitude through the `AnalyticsProvider` interface.
- Keep events privacy-first.
- Track activation, daily open, drip save/share, paywall views, and subscription conversion.

## Serverless Candidates

- RevenueCat webhook receiver.
- AI drip generation.
- Share link attribution.
- Referral rewards.
- Admin content ingestion.

## Operational Gaps

- No production Supabase project is wired yet.
- No EAS secret management policy is defined yet.
- No CI pipeline exists.
- No migration deployment process exists.
- No observability stack exists.
