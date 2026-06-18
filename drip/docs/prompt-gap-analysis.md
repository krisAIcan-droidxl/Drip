# Drip — prompt gap analysis

This document compares the current Expo app against the product prompt for **Drip** and records what is already implemented, what is partially implemented, and what is still missing.

## Executive summary

The app already captures the core MVP loop: a simple home screen with one primary action, local drip content, a reveal card, streaks, favorites, history, challenge completion, a premium paywall mock flow, and share-card generation.

The main gaps are not UI polish; they are production readiness and monetized back-end infrastructure. The prompt asks for Supabase, RevenueCat, OpenAI API, Firebase Analytics, premium packs, AI-generated drips, and full product/business deliverables. The codebase currently uses local persisted state and placeholder service modules for monetization and analytics, so it is best described as an offline prototype rather than a launch-ready freemium app.

## Prompt coverage checklist

| Area | Status | Evidence / notes |
| --- | --- | --- |
| One-button MVP loop | Implemented | Home screen centers one tappable drip action and routes successful taps to the reveal flow. |
| Logo / brand feel | Implemented | Custom droplet icon and branded assets are present. |
| Drip categories | Implemented | Supported categories are `QUOTE`, `CHALLENGE`, `REFLECTION`, `QUESTION`, `FACT`, and `INSIGHT`. |
| Example content | Implemented | Local fallback content includes challenges, questions, facts, insights, reflections, and quotes. |
| Daily streaks | Implemented locally | Streak is tracked in persisted local state based on local calendar dates. |
| Number of drips received | Implemented locally | `totalOpened` increments per successful drip request. |
| Favorites | Implemented locally | Favorites are persisted locally and limited by entitlement logic. |
| History | Implemented locally | History is persisted locally; full access is gated by entitlement logic. |
| Completed challenges | Implemented locally | Challenge completion IDs are tracked locally. |
| Free limit: 10 drips/day | Implemented locally | Entitlement logic gates non-premium users after 10 daily drips. |
| Premium unlimited drips | Partially implemented | Premium state unlocks limits, but purchase integration is stubbed. |
| Premium categories | Partially implemented | Paywall previews premium collections, but there is no pack/catalog data model. |
| Personal categories | Missing | No user-created category model or UI exists. |
| AI-generated drips | Missing | No OpenAI API client, server-side generation, moderation, or quota logic exists. |
| Premium packs | Missing | No purchase SKUs, pack ownership, pack content, or RevenueCat offerings exist. |
| Share as image/story | Implemented | Share screen captures a card image and saves/shares it. |
| Share as link / send to friend | Partially implemented | Native image share and copy text exist, but deep links and referral tracking are missing. |
| Supabase | Missing | No Supabase dependency, schema, auth, edge functions, or sync layer exists. |
| RevenueCat | Stub only | RevenueCat module simulates success without SDK dependency or real offerings. |
| OpenAI API | Missing | No dependency, API route/edge function, key handling, or content safety layer exists. |
| Firebase Analytics | Stub only | Analytics events are local no-ops in development terms, not Firebase-backed. |
| Complete PRD | Missing | No PRD document is present. |
| Database design | Missing | No schema migration or ERD is present. |
| App architecture document | Missing | No architecture document is present. |
| Monetization strategy | Missing | Only paywall UI and stub logic exist. |
| Growth strategy | Missing | Sharing exists, but no referral/share attribution strategy document exists. |
| MVP roadmap | Missing | No roadmap document exists. |
| Launch plan | Missing | No launch checklist or phased plan exists. |
| Risk analysis | Missing | No risk document exists. |
| Retention strategy | Missing | Local streaks exist, but no retention plan or notification strategy document exists. |
| First 100 paying users plan | Missing | No acquisition/conversion plan exists. |

## Brutally realistic launch blockers

1. **Payments are not real.** The premium subscribe and restore flows must use RevenueCat SDK offerings, entitlement checks, and receipt restoration before any paid launch.
2. **Analytics are not real.** Firebase Analytics or another production analytics tool is needed to measure activation, daily drip limit hits, paywall views, trial starts, conversion, retention, and sharing.
3. **No cloud data model exists.** Without Supabase, users lose cross-device history/favorites and the team cannot manage content, premium packs, AI quotas, or challenge completion reliably.
4. **AI must be server-side.** OpenAI API calls should not be made directly from the mobile app. Use a Supabase Edge Function or another backend endpoint with rate limits, prompt templates, and safety controls.
5. **Premium packs need product definition.** Packs require SKU strategy, ownership rules, content taxonomy, pack previews, and a path from free discovery to paid purchase.
6. **Sharing is not yet a growth loop.** Image sharing is useful, but link sharing, attribution, app-store routing, and referral rewards are missing.
7. **The prompt deliverables are absent.** The repo needs product docs before engineering work on backend and monetization can be sequenced with confidence.

## Recommended next sprint

### Week 1: make the prototype measurable

- Add Firebase Analytics and replace the analytics stub with real event logging.
- Add a minimal analytics event plan covering `drip_requested`, `drip_viewed`, `daily_limit_hit`, `paywall_viewed`, `purchase_started`, `purchase_completed`, `share_started`, `share_completed`, and `challenge_completed`.
- Add crash/error logging if the chosen Firebase package supports it or select a separate crash tool.

### Week 2: make premium real

- Add RevenueCat SDK configuration.
- Define monthly/yearly subscription products and entitlement IDs.
- Replace simulated `purchasePackage` and `restorePurchases` with RevenueCat calls.
- Add defensive paywall copy in DKK for Denmark if that is the target market.

### Week 3: add Supabase foundation

- Add Supabase schema for users, drips, drip packs, user history, favorites, daily usage, challenge completions, and AI generations.
- Keep the local fallback content for offline/demo mode, but load production content from Supabase.
- Add a `get_next_drip` edge function so daily limits and premium entitlements cannot be bypassed locally.

### Week 4: ship a narrow paid beta

- Do not build all packs first. Start with one strong pack, for example **Stoicism** or **Motivation**.
- Add 100–200 high-quality curated drips before adding AI.
- Recruit 50–100 beta users from founder-led channels and measure whether at least 20–30% return on day 2.

## First 100 paying users plan

1. Pick one wedge audience instead of marketing to everyone. Best first wedge: people interested in discipline, stoicism, motivation, or self-improvement.
2. Launch daily short-form content on TikTok, Instagram Reels, and LinkedIn with share-card visuals from the app.
3. Offer a founding-member annual price to the first cohort and collect feedback manually.
4. Use the 10-drips/day free limit as the primary paywall trigger, but test a softer paywall after favorites/history usage too.
5. Add one premium pack only after validating that users complete or favorite free drips.
6. Track conversion by source; stop any channel that cannot produce activated users who open at least three drips in their first week.

## Suggested product positioning

Drip should not be positioned as another quote app. A sharper positioning is:

> One meaningful thought, challenge, or question whenever your brain needs a reset.

This keeps the app simple, makes the daily limit feel intentional, and supports premium as depth and personalization rather than more feed-like content.
