import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CheckIcon, CloseIcon, DiamondIcon, LockIcon } from '@/src/components/Icons';
import { ScreenBackground } from '@/src/components/ScreenBackground';
import { useDrip } from '@/src/features/drip/useDrip';
import { GLASS_BG_STRONG, GLASS_BORDER, GOLD, GOLD_BUTTON_GRADIENT, GOLD_DARK, TEXT_DIM, hexToRgba } from '@/src/theme/colors';
import { SANS, SANS_BOLD, SANS_SEMIBOLD, SERIF } from '@/src/theme/fonts';

const FEATURES = [
  'Unlimited drips, any time of day',
  'The full archive, unlocked',
  'Curated collections — Stoics, Founders, Wonder',
  'Gentle reminders, on your schedule',
];

const PREVIEWS = [
  { label: 'STOICS', accent: '#8ccdbe', text: 'You have power over your mind — not outside events.' },
  { label: 'FOUNDERS', accent: '#eaaba5', text: 'Make something people want. Then tell people.' },
  { label: 'WONDER', accent: '#85c8e6', text: 'There are more trees on Earth than stars in the Milky Way.' },
];

export default function PremiumScreen() {
  const plan = useDrip((s) => s.plan);
  const selectPlan = useDrip((s) => s.selectPlan);
  const subscribe = useDrip((s) => s.subscribe);
  const restore = useDrip((s) => s.restore);
  const [busy, setBusy] = useState<'subscribe' | 'restore' | null>(null);

  const yearly = plan === 'yearly';

  const onSubscribe = async () => {
    setBusy('subscribe');
    const success = await subscribe();
    setBusy(null);
    if (success) {
      router.back();
    }
  };

  const onRestore = async () => {
    setBusy('restore');
    const isPremium = await restore();
    setBusy(null);
    Alert.alert(isPremium ? 'Purchases restored' : 'Nothing to restore', isPremium ? 'Drip Premium is active.' : 'No previous purchase was found.');
  };

  return (
    <ScreenBackground>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.root} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <CloseIcon size={16} />
          </Pressable>
          <Pressable onPress={onRestore} disabled={busy !== null}>
            <Text style={styles.restore}>{busy === 'restore' ? 'Restoring…' : 'Restore'}</Text>
          </Pressable>
        </View>

        <View style={styles.hero}>
          <View style={styles.diamondWrap}>
            <View style={styles.diamondGlow} />
            <DiamondIcon size={42} />
          </View>
          <Text style={styles.heroTitle}>Drip Premium</Text>
          <Text style={styles.heroSubtitle}>Open as many as you like, and keep every idea you&#8217;ve ever loved.</Text>
        </View>

        <View style={styles.features}>
          {FEATURES.map((f) => (
            <View key={f} style={styles.featureRow}>
              <View style={styles.checkBadge}>
                <CheckIcon size={13} />
              </View>
              <Text style={styles.featureLabel}>{f}</Text>
            </View>
          ))}
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={styles.tasteLabel}>A TASTE OF WHAT&#8217;S INSIDE</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {PREVIEWS.map((p) => (
              <View
                key={p.label}
                style={[styles.previewCard, { backgroundColor: hexToRgba(p.accent, 0.14) }]}
              >
                <View style={styles.previewHead}>
                  <View style={styles.previewHeadLeft}>
                    <View style={[styles.previewDot, { backgroundColor: p.accent }]} />
                    <Text style={styles.previewCategory}>{p.label}</Text>
                  </View>
                  <LockIcon size={13} />
                </View>
                <Text style={styles.previewText}>{p.text}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.plans}>
          <Pressable
            onPress={() => selectPlan('yearly')}
            style={[styles.planCard, yearly ? styles.planCardSelected : styles.planCardUnselected]}
          >
            <View style={styles.saveBadge}>
              <Text style={styles.saveBadgeLabel}>SAVE 42%</Text>
            </View>
            <Text style={styles.planLabel}>Yearly</Text>
            <Text style={styles.planPrice}>$34.99</Text>
            <Text style={styles.planSub}>$2.92 / month</Text>
          </Pressable>
          <Pressable
            onPress={() => selectPlan('monthly')}
            style={[styles.planCard, !yearly ? styles.planCardSelected : styles.planCardUnselected]}
          >
            <Text style={styles.planLabel}>Monthly</Text>
            <Text style={styles.planPrice}>$4.99</Text>
            <Text style={styles.planSub}>billed monthly</Text>
          </Pressable>
        </View>

        <Pressable onPress={onSubscribe} disabled={busy !== null} style={{ borderRadius: 18, overflow: 'hidden' }}>
          <LinearGradient colors={GOLD_BUTTON_GRADIENT} style={styles.cta}>
            {busy === 'subscribe' ? (
              <ActivityIndicator color={GOLD_DARK} />
            ) : (
              <Text style={styles.ctaLabel}>Start 7-day free trial</Text>
            )}
          </LinearGradient>
        </Pressable>
        <Text style={styles.ctaFootnote}>
          Then billed {yearly ? 'annually' : 'monthly'}. Cancel anytime.
        </Text>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: 58,
    paddingHorizontal: 26,
    paddingBottom: 34,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: GLASS_BG_STRONG,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restore: {
    fontFamily: SANS,
    fontSize: 13,
    color: TEXT_DIM(0.5),
  },
  hero: {
    alignItems: 'center',
    gap: 16,
    marginVertical: 18,
  },
  diamondWrap: {
    width: 84,
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diamondGlow: {
    position: 'absolute',
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(244,184,96,.45)',
  },
  heroTitle: {
    fontFamily: SERIF,
    fontSize: 34,
    letterSpacing: -0.8,
    color: '#eef1f8',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontFamily: SANS,
    fontSize: 15,
    lineHeight: 23,
    color: TEXT_DIM(0.6),
    textAlign: 'center',
    maxWidth: 280,
  },
  features: {
    gap: 14,
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(157,180,240,.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureLabel: {
    fontFamily: SANS,
    fontSize: 15,
    color: '#e6eaf5',
    flex: 1,
  },
  tasteLabel: {
    fontFamily: SANS_SEMIBOLD,
    fontSize: 11,
    letterSpacing: 2,
    color: TEXT_DIM(0.4),
    marginBottom: 13,
  },
  previewCard: {
    width: 174,
    borderRadius: 18,
    padding: 17,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.1)',
  },
  previewHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  previewHeadLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  previewDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  previewCategory: {
    fontFamily: SANS_SEMIBOLD,
    fontSize: 10,
    letterSpacing: 1.4,
    color: TEXT_DIM(0.62),
  },
  previewText: {
    fontFamily: SERIF,
    fontSize: 16,
    lineHeight: 22,
    color: '#e6eaf5',
  },
  plans: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22,
  },
  planCard: {
    flex: 1,
    position: 'relative',
    borderRadius: 18,
    padding: 18,
    paddingTop: 22,
    gap: 3,
    borderWidth: 1.5,
  },
  planCardSelected: {
    backgroundColor: 'rgba(157,180,240,.14)',
    borderColor: '#9db4f0',
  },
  planCardUnselected: {
    backgroundColor: 'rgba(255,255,255,.04)',
    borderColor: 'rgba(255,255,255,.09)',
  },
  saveBadge: {
    position: 'absolute',
    top: -10,
    left: '50%',
    transform: [{ translateX: -34 }],
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: GOLD,
  },
  saveBadgeLabel: {
    fontFamily: SANS_BOLD,
    fontSize: 10,
    letterSpacing: 0.4,
    color: GOLD_DARK,
  },
  planLabel: {
    fontFamily: SANS,
    fontSize: 13,
    color: TEXT_DIM(0.55),
  },
  planPrice: {
    fontFamily: SERIF,
    fontSize: 28,
    color: '#eef1f8',
  },
  planSub: {
    fontFamily: SANS,
    fontSize: 12,
    color: TEXT_DIM(0.45),
  },
  cta: {
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLabel: {
    fontFamily: SANS_BOLD,
    fontSize: 16,
    color: GOLD_DARK,
  },
  ctaFootnote: {
    fontFamily: SANS,
    fontSize: 12,
    color: TEXT_DIM(0.4),
    textAlign: 'center',
    marginTop: 14,
  },
});
