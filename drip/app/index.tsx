import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { DropletIcon } from '@/src/components/DropletIcon';
import { RadialGlow } from '@/src/components/RadialGlow';
import { ScreenBackground } from '@/src/components/ScreenBackground';
import { useDrip } from '@/src/features/drip/useDrip';
import { TEXT_DIM } from '@/src/theme/colors';
import { SANS_SEMIBOLD, SERIF } from '@/src/theme/fonts';

export default function SplashRoute() {
  const onboarded = useDrip((s) => s.onboarded);
  const glow = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 2250, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 2250, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    const t = setTimeout(() => {
      router.replace(onboarded ? '/(tabs)' : '/onboarding');
    }, 2400);
    return () => clearTimeout(t);
  }, [onboarded, glow, float]);

  return (
    <ScreenBackground>
      <View style={styles.center}>
        <View style={styles.iconWrap}>
          <Animated.View
            style={[
              styles.glow,
              {
                opacity: glow.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }),
                transform: [{ scale: glow.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] }) }],
              },
            ]}
          >
            <RadialGlow width={190} color="#9db4f0" opacity={0.9} />
          </Animated.View>
          <Animated.View
            style={{
              transform: [{ translateY: float.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) }],
            }}
          >
            <DropletIcon size={104} gradient />
          </Animated.View>
        </View>
        <Text style={styles.wordmark}>drip</Text>
        <Text style={styles.tagline}>one idea at a time</Text>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 26,
  },
  iconWrap: {
    width: 104,
    height: 104,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 190,
    height: 190,
  },
  wordmark: {
    fontFamily: SERIF,
    fontSize: 50,
    letterSpacing: -1.5,
    color: '#eef1f8',
  },
  tagline: {
    fontFamily: SANS_SEMIBOLD,
    fontSize: 12,
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: TEXT_DIM(0.5),
  },
});
