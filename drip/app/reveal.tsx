import { router } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { DropletIcon } from '@/src/components/DropletIcon';
import { BackArrowIcon, HeartIcon, ShareIcon } from '@/src/components/Icons';
import { ScreenBackground } from '@/src/components/ScreenBackground';
import { getDripById } from '@/src/features/drip/dripService';
import { useDrip } from '@/src/features/drip/useDrip';
import { CATEGORY_ACCENT, CATEGORY_PROMPT, GLASS_BG_STRONG, GLASS_BORDER, LIGHT_BUTTON_GRADIENT, TEXT_DIM, hexToRgba } from '@/src/theme/colors';
import { SANS_SEMIBOLD, SERIF, SERIF_ITALIC } from '@/src/theme/fonts';

function Word({ text, delay }: { text: string; delay: number }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: 420, delay, useNativeDriver: true }).start();
  }, [v, delay]);
  return (
    <Animated.Text
      style={{
        opacity: v,
        transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
      }}
    >
      {text + ' '}
    </Animated.Text>
  );
}

export default function RevealScreen() {
  const currentDripId = useDrip((s) => s.currentDripId);
  const favIds = useDrip((s) => s.favIds);
  const toggleFavorite = useDrip((s) => s.toggleFavorite);

  const drip = currentDripId != null ? getDripById(currentDripId) : undefined;
  const favorited = drip ? favIds.includes(drip.id) : false;
  const accent = drip ? CATEGORY_ACCENT[drip.category] : '#85c8e6';
  const prompt = drip ? CATEGORY_PROMPT[drip.category] : '';

  const words = useMemo(() => (drip ? drip.text.split(' ') : []), [drip]);

  useEffect(() => {
    if (!drip) {
      router.replace('/(tabs)');
    }
  }, [drip]);

  if (!drip) {
    return null;
  }

  const onSave = () => {
    const ok = toggleFavorite(drip.id);
    if (!ok) {
      router.push('/premium');
    }
  };

  return (
    <ScreenBackground>
      <View style={styles.root}>
        <View style={styles.topRow}>
          <Pressable onPress={() => router.replace('/(tabs)')} style={styles.iconButton}>
            <BackArrowIcon size={18} />
          </Pressable>
          <View style={[styles.catPill, { backgroundColor: hexToRgba(accent, 0.14), borderColor: hexToRgba(accent, 0.4) }]}>
            <View style={[styles.catDot, { backgroundColor: accent }]} />
            <Text style={[styles.catLabel, { color: '#eef1f8' }]}>{drip.category}</Text>
          </View>
          <View style={styles.iconButton} />
        </View>

        <View style={styles.cardWrap}>
          <View style={[styles.glow, { backgroundColor: hexToRgba(accent, 0.5) }]} />
          <View style={styles.card}>
            <View style={[styles.cardTopLine, { backgroundColor: accent }]} />
            <DropletIcon size={28} color={accent} />
            <Text style={[styles.catPrompt, { color: accent }]}>{prompt}</Text>
            <Text style={styles.dripText}>
              {words.map((w, i) => (
                <Word key={i} text={w} delay={200 + i * 40} />
              ))}
            </Text>
            {drip.author ? <Text style={styles.author}>— {drip.author}</Text> : null}
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable onPress={onSave} style={styles.saveButton}>
            <HeartIcon size={20} filled={favorited ? accent : null} color={hexToRgba('#eef1f8', 0.6)} />
            <Text style={styles.actionLabel}>Save</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/share')} style={{ borderRadius: 16, overflow: 'hidden' }}>
            <LinearGradient colors={LIGHT_BUTTON_GRADIENT} style={styles.shareButton}>
              <ShareIcon size={19} />
              <Text style={[styles.actionLabel, { color: '#12162a' }]}>Share</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 26,
    paddingBottom: 40,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: GLASS_BG_STRONG,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  catDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  catLabel: {
    fontFamily: SANS_SEMIBOLD,
    fontSize: 11,
    letterSpacing: 2,
  },
  cardWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.5,
  },
  card: {
    width: '100%',
    borderRadius: 28,
    padding: 36,
    backgroundColor: 'rgba(255,255,255,.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.12)',
    overflow: 'hidden',
  },
  cardTopLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    opacity: 0.8,
  },
  catPrompt: {
    fontFamily: SERIF_ITALIC,
    fontSize: 14,
    letterSpacing: 0.3,
    marginTop: 14,
    marginBottom: 16,
  },
  dripText: {
    fontFamily: SERIF,
    fontSize: 30,
    lineHeight: 40,
    letterSpacing: -0.3,
    color: '#eef1f8',
  },
  author: {
    fontFamily: SERIF_ITALIC,
    fontSize: 16,
    color: TEXT_DIM(0.6),
    marginTop: 24,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    height: 52,
    paddingHorizontal: 22,
    borderRadius: 16,
    backgroundColor: GLASS_BG_STRONG,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    height: 52,
    paddingHorizontal: 22,
  },
  actionLabel: {
    fontFamily: SANS_SEMIBOLD,
    fontSize: 14,
    color: '#eef1f8',
  },
});
