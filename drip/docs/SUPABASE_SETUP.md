# Supabase Setup

## Current Project

The local app is linked to the Supabase project:

- Name: `Drip`
- Project ref: `zaloxeusmmfjoilwbrgy`
- URL: `https://zaloxeusmmfjoilwbrgy.supabase.co`

Migration status has been verified with `supabase migration list`: local migrations match remote migrations through `003`.

Anonymous auth has been enabled and verified with a real `signInAnonymously()` call. The app bootstrap writes to `users`, `profiles`, and `user_streaks` have also been verified against RLS.

Local state sync and server-to-local restore for history, favorites, and streak have been verified against RLS with a real anonymous session.

## 1. Project Env

The local `.env` contains:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_REVENUECAT_API_KEY_IOS`
- `EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID`
- `EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID`
- `EXPO_PUBLIC_REVENUECAT_OFFERING_ID`

For another machine, create `.env` from `.env.example`:

```bash
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=appl_...
EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID=goog_...
EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID=premium
EXPO_PUBLIC_REVENUECAT_OFFERING_ID=
```

Do not put service-role keys in the Expo app.

## 2. Apply Schema

Already applied to the linked remote project:

```bash
supabase db push
```

The schema source is `supabase/migrations/001_initial_schema.sql`.

## 3. Anonymous Auth

The current MVP bootstrap uses anonymous auth so users can start without a login screen. This is enabled for the linked remote project.

If this is recreated in another project, enable it in Supabase Dashboard:

- Go to Authentication
- Enable anonymous sign-ins
- Keep email/social auth for a later account upgrade flow

## 4. Verify RLS

The migration enables Row Level Security. Confirm that:

- public active drips are readable
- authenticated users can read/write only their own profile/history/favorites/streak/subscription rows
- service-role operations are reserved for server-side functions

## 5. Next Sync Work

Current app startup now bootstraps Supabase auth when env vars exist, restores server state, merges it locally, and uploads merged local Zustand state:

- local favorites
- local history
- local streak state
- server-backed premium entitlement

The next implementation step is strengthening conflict handling and product semantics:

- RevenueCat webhook writes to `subscriptions`
- decide whether favorite removals on one device should remove favorites on all devices
- decide maximum history retention and cleanup
- keep AsyncStorage as offline cache

## 6. RevenueCat Client

The app now uses `react-native-purchases` for RevenueCat configure, offering lookup, purchase, restore, and customer entitlement fallback.

RevenueCat native modules require an Expo development build or production build. They will not work in plain Expo Go.

Expected RevenueCat dashboard setup:

- Entitlement id: `premium` unless `EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID` is changed.
- Current offering with monthly and annual packages.
- iOS API key in `EXPO_PUBLIC_REVENUECAT_API_KEY_IOS`.
- Android API key in `EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID`.

Supabase remains the trusted source for server-backed premium state. RevenueCat webhooks still need to write subscription updates into `public.subscriptions`.

## 7. RevenueCat Webhook

Local function source:

```bash
supabase/functions/revenuecat-webhook/index.ts
```

Set server-side secrets before deploying:

```bash
supabase secrets set REVENUECAT_WEBHOOK_SECRET=...
supabase secrets set REVENUECAT_ENTITLEMENT_ID=premium
```

Deploy:

```bash
supabase functions deploy revenuecat-webhook --no-verify-jwt
```

Configure RevenueCat Dashboard:

- Webhook URL: `https://zaloxeusmmfjoilwbrgy.functions.supabase.co/revenuecat-webhook`
- Authorization header: `Bearer <REVENUECAT_WEBHOOK_SECRET>`
- App user id must be the Supabase `auth.users.id`. The app configures RevenueCat with that id after anonymous auth bootstrap.

The webhook writes RevenueCat events into `public.subscriptions` with the service role key. Client-side writes to `subscriptions` remain blocked by RLS.

The deployed endpoint has been smoke-tested with a RevenueCat `TEST` event and returned `200`.

## Notes

If env vars are missing, the app remains in local-only mode. This is intentional for development and Expo previews.
