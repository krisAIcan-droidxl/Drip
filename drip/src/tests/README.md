# Test Plan

No JavaScript test framework is configured yet. Recommended setup:

- Jest or Vitest for pure TypeScript rules.
- React Native Testing Library for component behavior.
- Detox or Maestro for critical mobile flows.

First tests to add:

- `features/drips/dripRules`: primary daily drip, extra drip limit, no same-day repeats.
- `features/drips/streakRules`: first open, consecutive day, broken streak, same-day no-op.
- `features/premium/limits`: free vs premium limits.
- `services/storage`: JSON fallback and malformed value handling.

Keep core rules pure so they can be tested without Expo or React Native.
