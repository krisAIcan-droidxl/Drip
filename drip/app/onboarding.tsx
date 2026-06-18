import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DropletIcon } from '@/src/components/DropletIcon';
import { ScreenBackground } from '@/src/components/ScreenBackground';
import { useDrip } from '@/src/features/drip/useDrip';
import { LIGHT_BUTTON_GRADIENT, ONBOARDING_ACCENTS, TEXT_DIM, hexToRgba } from '@/src/theme/colors';
import { SANS, SANS_SEMIBOLD, SERIF } from '@/src/theme/fonts';

const STEPS = [
  {
    title: 'One tap. One idea.',
    body: 'No feeds. No noise. A single thought, chosen to be worth your full attention.',
  },
  {
    title: 'A small gift, daily.',
    body: 'Questions, challenges, quotes and quiet facts — made to make you think, not scroll.',
  },
  {
    title: 'Build a quiet habit.',
    body: 'Open Drip once a day. Keep your streak. Keep whatever moves you.',
  },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const finishOnboarding = useDrip((s) => s.finishOnboarding);
  const accent = ONBOARDING_ACCENTS[step];
  const data = STEPS[step];
  const isLast = step >= STEPS.length - 1;

  const finish = () => {
    finishOnboarding();
    router.replace('/(tabs)');
  };

  const onNext = () => {
    if (isLast) {
      finish();
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <ScreenBackground>
      <View style={styles.root}>
        <View style={styles.topRow}>
          <View style={styles.dots}>
            {STEPS.map((_, i) => (
              <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
            ))}
          </View>
          <Pressable onPress={finish} hitSlop={8}>
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        </View>

        <View style={styles.illoWrap}>
          <View style={styles.illo}>
            <View style={[styles.glow, { backgroundColor: hexToRgba(accent, 0.45) }]} />
            <View style={styles.ringSmall} />
            <View style={styles.ringLarge} />
            <DropletIcon size={58} color="#eef2ff" />
          </View>
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.body}>{data.body}</Text>
        </View>

        <Pressable onPress={onNext} style={{ borderRadius: 18, overflow: 'hidden' }}>
          <LinearGradient colors={LIGHT_BUTTON_GRADIENT} style={styles.cta}>
            <Text style={styles.ctaLabel}>{isLast ? 'Begin' : 'Continue'}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 62,
    paddingHorizontal: 30,
    paddingBottom: 38,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dots: {
    flexDirection: 'row',
    gap: 7,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,.18)',
  },
  dotActive: {
    width: 26,
    backgroundColor: '#cdd8f5',
  },
  skip: {
    fontFamily: SANS,
    fontSize: 14,
    color: TEXT_DIM(0.5),
  },
  illoWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illo: {
    width: 230,
    height: 230,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,
  },
  ringSmall: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.14)',
  },
  ringLarge: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.06)',
  },
  textBlock: {
    gap: 14,
    marginBottom: 34,
  },
  title: {
    fontFamily: SERIF,
    fontSize: 36,
    lineHeight: 39,
    letterSpacing: -1,
    color: '#eef1f8',
  },
  body: {
    fontFamily: SANS,
    fontSize: 16,
    lineHeight: 25,
    color: TEXT_DIM(0.6),
    maxWidth: 300,
  },
  cta: {
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLabel: {
    fontFamily: SANS_SEMIBOLD,
    fontSize: 16,
    color: '#12162a',
  },
});
