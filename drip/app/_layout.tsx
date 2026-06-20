import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useDrip } from '@/src/features/drip/useDrip';
import { AnalyticsEvents } from '@/src/services/analytics/events';
import { revenueCatService } from '@/src/services/revenuecat';
import { bootstrapAuth } from '@/src/services/supabase/auth';
import { restoreSupabaseDripState, syncLocalDripStateToSupabase } from '@/src/services/supabase/sync';
import { FONT_MAP } from '@/src/theme/fonts';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts(FONT_MAP);
  const hasHydrated = useDrip((s) => s.hasHydrated);
  const ready = fontsLoaded && hasHydrated;

  useEffect(() => {
    AnalyticsEvents.appOpened();
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    void bootstrapAuth().then(async (result) => {
      if (result.status !== 'signed_in') return;
      await revenueCatService.configure(result.session.user?.id);
      await useDrip.getState().refreshPremiumEntitlement();
      const state = useDrip.getState();
      const localSnapshot = {
        favIds: state.favIds,
        history: state.history,
        streak: state.streak,
        lastActiveDateKey: state.lastActiveDateKey,
      };
      const restore = await restoreSupabaseDripState(localSnapshot);
      if (restore.state) {
        useDrip.getState().mergeRemoteState(restore.state);
      }
      const merged = useDrip.getState();
      void syncLocalDripStateToSupabase({
        favIds: merged.favIds,
        history: merged.history,
        streak: merged.streak,
        lastActiveDateKey: merged.lastActiveDateKey,
      });
    });
  }, [hasHydrated]);

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: 'fade', contentStyle: { backgroundColor: '#080b16' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="reveal" options={{ animation: 'fade' }} />
        <Stack.Screen name="premium" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="share" options={{ presentation: 'transparentModal', animation: 'fade' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
