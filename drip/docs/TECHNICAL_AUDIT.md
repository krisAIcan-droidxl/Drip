# Drip Technical Audit

Last updated: 2026-06-18

## Executive Summary

Drip currently works as a polished local Expo prototype: it has real screens, Expo Router navigation, local curated drips, persisted Zustand state, local favorites/history/streaks, and mock monetization/analytics. It is not yet production-ready because backend persistence, auth, server-side entitlement validation, database rules, AI generation, analytics delivery, environment management, and test infrastructure are mostly stubs or missing.

The safest next step is to keep the UI stable and add a professional foundation around it: typed domain models, a storage layer, integration adapters, Supabase schema/RLS, service boundaries, validation, and privacy-first analytics contracts.

## Current Structure

- `app/`: Expo Router routes and screens. This is the real app entrypoint surface.
- `src/components/`: shared visual components, icons, background, and bottom nav.
- `src/features/drip/`: current core MVP data/state implementation.
- `src/features/monetization/`: mock entitlement and mock purchase helpers.
- `src/features/analytics/`: console-only analytics stub.
- `src/content/fallbackDrips.json`: curated offline drip pool.
- `src/theme/`: colors and fonts.
- `docs/`: product/gap docs.

## Entry Points

- `package.json` uses `expo-router/entry`.
- `app/_layout.tsx` loads fonts, waits for Zustand hydration, hides splash screen, and registers stack routes.
- `app/index.tsx` is the branded splash/entry route and redirects to onboarding or tabs.
- `app/(tabs)/_layout.tsx` defines tab routes with a custom bottom nav.

## Navigation

Navigation is handled by Expo Router. The app has:

- Splash: `/`
- Onboarding: `/onboarding`
- Tabs: `/(tabs)` with home, favorites, history, profile
- Reveal: `/reveal`
- Premium: `/premium`
- Share modal: `/share`

This is a reasonable MVP navigation model. It needs typed route discipline and auth-aware routing once Supabase Auth is introduced.

## Component Structure

The current component structure is small and visually focused. It should be expanded without redesigning:

- `components/ui`: primitive buttons, cards, text, loaders later.
- `components/drip`: drip-specific cards/seals/reveal components later.
- `components/layout`: app shells, safe-area containers, navigation wrappers later.

## State Management

Current state is centralized in `src/features/drip/useDrip.ts` with Zustand + AsyncStorage persistence. It stores:

- onboarding state
- premium mock state
- favorites
- history
- completed challenges
- streak and last active day
- daily usage count
- draw queue/current drip

This is fine for MVP, but production should split domain logic from store mutation and sync authenticated data to Supabase.

## Data Handling

Drips are local JSON only. The draw logic uses a shuffle bag in `dripService.ts`. There is no remote data source, no user-specific server state, and no server-side daily limit enforcement.

## Local Storage

AsyncStorage persistence is configured directly inside the Zustand store. This works but couples storage to feature state. A storage service layer has been added so future migrations and encrypted storage decisions are isolated.

## API Layer

There was no general API wrapper. Production needs a small fetch wrapper with safe errors, timeouts, auth headers, and minimal logging. A stub service boundary is now added under `src/services/api`.

## Auth Preparation

No auth exists yet. Supabase Auth is the recommended first implementation because it pairs with the database/RLS model. Auth stubs and schema assumptions are documented.

## Database Preparation

No database existed. A Supabase SQL migration is now added for profiles, drip categories, drips, history, favorites, streaks, subscriptions, shares, and feedback, including RLS policies.

## Monetization Preparation

Existing monetization is mocked locally. It has useful product limits but no RevenueCat SDK, no receipt validation, no webhook handling, and no server trust boundary. A RevenueCat service stub with plans/entitlements has been added.

## Analytics Preparation

Existing analytics only logs in development. A privacy-first analytics interface has been added with the requested event vocabulary and provider abstraction.

## Error Handling

Current screens mostly use direct alerts or silent returns. Production should use typed app errors, safe messages for users, and minimal private logging. A safe error helper has been added.

## Security Risks

- No server-side enforcement of premium limits.
- No auth or RLS-backed user data.
- OpenAI must not be called directly from the mobile app.
- Analytics must not log raw personal content by default.
- AsyncStorage is not encrypted; avoid storing secrets or sensitive profile data.
- Existing mocks can be mistaken for real integrations unless clearly documented.

## Testing

There is no test framework configured. Because no Jest/Vitest setup exists, tests are documented as required follow-up rather than added with new dependencies. The first tests should target daily drip selection, streak logic, premium limits, and storage serialization.

## Environment Variables

`.env.example` has been added with the required public Expo variables. No secrets should be committed. OpenAI should be called through a backend/serverless proxy, not directly from the app.

## Mocked Today

- RevenueCat purchases and restore.
- Analytics provider delivery.
- Supabase client/auth calls.
- OpenAI drip generation.
- Server-side daily limits and entitlement validation.
- Push notifications.

## Production-Ready Checklist

- Add Supabase project and apply migrations.
- Install and wire `@supabase/supabase-js`.
- Implement Supabase Auth and profile bootstrap.
- Move user history/favorites/streaks to Supabase with offline cache.
- Install and wire RevenueCat SDK.
- Validate entitlements server-side or through RevenueCat webhooks.
- Add analytics SDK (Firebase, PostHog, or Amplitude).
- Build Supabase Edge Function for AI drips with rate limits and safety filters.
- Add automated tests.
- Add crash/error reporting.
- Add privacy policy, terms, and account deletion flow.
