# Supabase Setup

## Current Project

The local app is linked to the Supabase project:

- Name: `Drip`
- Project ref: `zaloxeusmmfjoilwbrgy`
- URL: `https://zaloxeusmmfjoilwbrgy.supabase.co`

Migration status has been verified with `supabase migration list`: local `001` matches remote `001`.

Anonymous auth has been enabled and verified with a real `signInAnonymously()` call. The app bootstrap writes to `users`, `profiles`, and `user_streaks` have also been verified against RLS.

## 1. Project Env

The local `.env` contains:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

For another machine, create `.env` from `.env.example`:

```bash
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
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

Current app startup now bootstraps Supabase auth when env vars exist. The next implementation step is to sync local Zustand state:

- upload local favorites
- upload local history
- upload streak state
- read server premium entitlement
- keep AsyncStorage as offline cache

## Notes

If env vars are missing, the app remains in local-only mode. This is intentional for development and Expo previews.
