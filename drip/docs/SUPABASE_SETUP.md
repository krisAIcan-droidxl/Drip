# Supabase Setup

## 1. Create Project

Create a Supabase project and copy:

- Project URL
- Anon public key

Add them to `.env`:

```bash
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

Do not put service-role keys in the Expo app.

## 2. Apply Schema

Apply:

```bash
supabase db push
```

or run `supabase/migrations/001_initial_schema.sql` through the Supabase SQL editor.

## 3. Enable Anonymous Auth

The current MVP bootstrap uses anonymous auth so users can start without a login screen.

In Supabase Dashboard:

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
