import { router } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';

import { DropletIcon } from '@/src/components/DropletIcon';
import { FlameIcon } from '@/src/components/Icons';
import { RadialGlow } from '@/src/components/RadialGlow';
import { ScreenBackground } from '@/src/components/ScreenBackground';
import { useDrip } from '@/src/features/drip/useDrip';
import { GLASS_BG_STRONG, GLASS_BORDER, TEXT_DIM } from '@/src/theme/colors';
import { SANS, SANS_SEMIBOLD, SERIF, SERIF_ITALIC } from '@/src/theme/fonts';

const CURIOSITY_LINES = [
  'Something is waiting for you.',
  'Today’s idea is sealed.',
  'One thought was chosen for today.',
  'A small gift, still unopened.',
];

function useRingPulse(delayMs: number) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.sequence([
      Animated.delay(delayMs),
      Animated.loop(
        Animated.sequence([
          Animated.timing(v, { toValue: 1, duration: 3400, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(v, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      ),
    ]);
    anim.start();
    return () => anim.stop();
  }, [v, delayMs]);
  return v;
}

function PulseRing({ delayMs }: { delayMs: number }) {
  const v = useRingPulse(delayMs);
  return (
    <Animated.View
      style={[
        styles.ring,
        {
          opacity: v.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0.55, 0.4, 0] }),
          transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.72, 1.55] }) }],
        },
      ]}
    />
  );
}

export default function HomeScreen() {
  const streak = useDrip((s) => s.streak);
  const requestDrip = useDrip((s) => s.requestDrip);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    return h < 5 ? 'Good night' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  }, []);
  const dateLabel = useMemo(
    () => new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
    []
  );
  const curiosity = useMemo(
    () => CURIOSITY_LINES[Math.floor(Date.now() / 86400000) % CURIOSITY_LINES.length],
    []
  );

  const onTapDrip = () => {
    const result = requestDrip();
    if (result.ok) {
      router.push('/reveal');
    } else {
      router.push('/premium');
    }
  };

  return (
    <ScreenBackground>
      <View style={styles.root}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.date}>{dateLabel}</Text>
          </View>
          <View style={styles.streakPill}>
            <FlameIcon size={15} />
            <Text style={styles.streakLabel}>{streak}</Text>
          </View>
        </View>

        <View style={styles.center}>
          <Pressable onPress={onTapDrip} style={styles.tapCircle}>
            <PulseRing delayMs={0} />
            <PulseRing delayMs={1100} />
            <PulseRing delayMs={2200} />
            <View style={styles.outerGlow}>
              <RadialGlow width={200} color="#9db4f0" opacity={0.8} />
            </View>
            <View style={styles.glassCircle}>
              <DropletIcon size={40} color="#eef2ff" />
              <Text style={styles.tapLabel}>Tap for your Drip</Text>
            </View>
          </Pressable>

          <View style={styles.captionBlock}>
            <View style={styles.captionRow}>
              <View style={styles.captionLine} />
              <Text style={styles.captionLabel}>TODAY&#8217;S DRIP &middot; UNOPENED</Text>
              <View style={styles.captionLine} />
            </View>
            <Text style={styles.curiosity}>{curiosity}</Text>
          </View>
        </View>
      </View>
    </ScreenBackground>
  );
}

const RING_SIZE = 238;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 64,
    paddingHorizontal: 26,
    paddingBottom: 110,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  greeting: {
    fontFamily: SERIF,
    fontSize: 26,
    letterSpacing: -0.5,
    color: '#eef1f8',
  },
  date: {
    fontFamily: SANS,
    fontSize: 13,
    color: TEXT_DIM(0.5),
    marginTop: 4,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 19,
    backgroundColor: GLASS_BG_STRONG,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
  },
  streakLabel: {
    fontFamily: SANS_SEMIBOLD,
    fontSize: 14,
    color: '#eef1f8',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 42,
  },
  tapCircle: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 1,
    borderColor: 'rgba(157,180,240,.4)',
  },
  outerGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
  },
  glassCircle: {
    width: 182,
    height: 182,
    borderRadius: 91,
    backgroundColor: 'rgba(255,255,255,.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.22)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  tapLabel: {
    fontFamily: SANS_SEMIBOLD,
    fontSize: 14,
    color: '#eef1f8',
  },
  captionBlock: {
    alignItems: 'center',
    gap: 11,
  },
  captionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  captionLine: {
    width: 18,
    height: 1,
    backgroundColor: 'rgba(238,241,248,.22)',
  },
  captionLabel: {
    fontFamily: SANS_SEMIBOLD,
    fontSize: 11,
    letterSpacing: 3,
    color: TEXT_DIM(0.5),
  },
  curiosity: {
    fontFamily: SERIF_ITALIC,
    fontSize: 18,
    color: TEXT_DIM(0.72),
    textAlign: 'center',
    maxWidth: 250,
  },
});
