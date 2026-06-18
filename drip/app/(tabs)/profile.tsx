import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { DiamondIcon } from '@/src/components/Icons';
import { ScreenBackground } from '@/src/components/ScreenBackground';
import { useDrip } from '@/src/features/drip/useDrip';
import { TEXT_DIM } from '@/src/theme/colors';
import { SANS, SERIF, SERIF_ITALIC } from '@/src/theme/fonts';

const SETTINGS_ROWS = [
  { label: 'Notifications', value: 'On' },
  { label: 'Daily reminder', value: '8:00 AM' },
  { label: 'Appearance', value: 'Cinematic' },
  { label: 'Account', value: '' },
];

export default function ProfileScreen() {
  const streak = useDrip((s) => s.streak);
  const totalOpened = useDrip((s) => s.totalOpened);
  const favCount = useDrip((s) => s.favIds.length);
  const isPremium = useDrip((s) => s.isPremium);

  return (
    <ScreenBackground>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.root} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarBlock}>
          <LinearGradient colors={['#8ea7ec', '#b69ae0']} style={styles.avatar}>
            <Text style={styles.avatarLabel}>AR</Text>
          </LinearGradient>
          <View style={{ alignItems: 'center', gap: 3 }}>
            <Text style={styles.name}>Alex Rivera</Text>
            <Text style={styles.since}>Drinking ideas since 2025</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>day ritual</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalOpened}</Text>
            <Text style={styles.statLabel}>ideas met</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{favCount}</Text>
            <Text style={styles.statLabel}>kept close</Text>
          </View>
        </View>

        <Text style={styles.ritual}>A quiet ritual, {streak} days strong.</Text>

        {!isPremium && (
          <Pressable style={styles.premiumBanner} onPress={() => router.push('/premium')}>
            <View style={{ gap: 3 }}>
              <Text style={styles.premiumTitle}>Unlock Drip Premium</Text>
              <Text style={styles.premiumSubtitle}>Unlimited ideas & the full archive</Text>
            </View>
            <DiamondIcon size={42} />
          </Pressable>
        )}

        <View style={styles.settingsCard}>
          {SETTINGS_ROWS.map((row, i) => (
            <View key={row.label} style={[styles.settingsRow, i < SETTINGS_ROWS.length - 1 && styles.settingsRowBorder]}>
              <Text style={styles.settingsLabel}>{row.label}</Text>
              <Text style={styles.settingsValue}>
                {row.value ? `${row.value} ›` : '›'}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: 62,
    paddingHorizontal: 24,
    paddingBottom: 110,
  },
  avatarBlock: {
    alignItems: 'center',
    gap: 14,
    marginBottom: 26,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLabel: {
    fontFamily: SERIF,
    fontSize: 32,
    color: '#10142a',
  },
  name: {
    fontFamily: SERIF,
    fontSize: 24,
    letterSpacing: -0.4,
    color: '#eef1f8',
  },
  since: {
    fontFamily: SANS,
    fontSize: 13,
    color: TEXT_DIM(0.45),
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.08)',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontFamily: SERIF,
    fontSize: 26,
    color: '#eef1f8',
  },
  statLabel: {
    fontFamily: SANS,
    fontSize: 11,
    color: TEXT_DIM(0.45),
  },
  ritual: {
    fontFamily: SERIF_ITALIC,
    fontSize: 15,
    color: TEXT_DIM(0.55),
    textAlign: 'center',
    marginBottom: 22,
  },
  premiumBanner: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 22,
    backgroundColor: 'rgba(244,184,96,.12)',
    borderWidth: 1,
    borderColor: 'rgba(244,184,96,.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  premiumTitle: {
    fontFamily: SERIF,
    fontSize: 19,
    color: '#eef1f8',
  },
  premiumSubtitle: {
    fontFamily: SANS,
    fontSize: 13,
    color: TEXT_DIM(0.6),
  },
  settingsCard: {
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.07)',
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  settingsRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,.06)',
  },
  settingsLabel: {
    fontFamily: SANS,
    fontSize: 15,
    color: '#eef1f8',
  },
  settingsValue: {
    fontFamily: SANS,
    fontSize: 13,
    color: TEXT_DIM(0.4),
  },
});
