import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { LockIcon } from '@/src/components/Icons';
import { ScreenBackground } from '@/src/components/ScreenBackground';
import { getDripById, relativeTime } from '@/src/features/drip/dripService';
import { useDrip } from '@/src/features/drip/useDrip';
import { FREE_HISTORY_PREVIEW_COUNT } from '@/src/features/monetization/entitlements';
import { CATEGORY_ACCENT, TEXT_DIM } from '@/src/theme/colors';
import { SANS, SANS_SEMIBOLD, SERIF } from '@/src/theme/fonts';

export default function HistoryScreen() {
  const history = useDrip((s) => s.history);
  const totalOpened = useDrip((s) => s.totalOpened);
  const isPremium = useDrip((s) => s.isPremium);

  const visible = isPremium ? history : history.slice(0, FREE_HISTORY_PREVIEW_COUNT);
  const lockedCount = history.length - visible.length;

  return (
    <ScreenBackground>
      <View style={styles.root}>
        <View style={styles.header}>
          <Text style={styles.title}>History</Text>
          <Text style={styles.count}>{totalOpened} ideas met</Text>
        </View>

        {history.length === 0 ? (
          <Text style={styles.empty}>Every idea you open will land here.</Text>
        ) : (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            {visible.map((entry) => {
              const drip = getDripById(entry.dripId);
              if (!drip) return null;
              const accent = CATEGORY_ACCENT[drip.category];
              return (
                <View key={entry.entryId} style={styles.row}>
                  <View style={[styles.dot, { backgroundColor: accent }]} />
                  <View style={styles.rowBody}>
                    <Text style={styles.rowText} numberOfLines={2}>
                      {drip.text}
                    </Text>
                    <View style={styles.metaRow}>
                      <Text style={styles.metaCategory}>{drip.category}</Text>
                      <Text style={styles.metaTime}>· {relativeTime(entry.timestamp)}</Text>
                    </View>
                  </View>
                </View>
              );
            })}

            {lockedCount > 0 && (
              <Pressable style={styles.lockCard} onPress={() => router.push('/premium')}>
                <LockIcon size={16} />
                <Text style={styles.lockText}>
                  {lockedCount} earlier idea{lockedCount === 1 ? '' : 's'} — unlock full history with Premium
                </Text>
              </Pressable>
            )}
          </ScrollView>
        )}
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 62,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 22,
    paddingHorizontal: 2,
  },
  title: {
    fontFamily: SERIF,
    fontSize: 32,
    letterSpacing: -0.5,
    color: '#eef1f8',
  },
  count: {
    fontFamily: SANS,
    fontSize: 13,
    color: TEXT_DIM(0.45),
  },
  list: {
    paddingBottom: 110,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingVertical: 15,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,.06)',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  rowBody: {
    flex: 1,
    gap: 5,
  },
  rowText: {
    fontFamily: SERIF,
    fontSize: 16,
    lineHeight: 22,
    color: '#e3e8f4',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaCategory: {
    fontFamily: SANS,
    fontWeight: '600',
    fontSize: 10,
    letterSpacing: 1.4,
    color: TEXT_DIM(0.4),
  },
  metaTime: {
    fontFamily: SANS,
    fontSize: 11,
    color: TEXT_DIM(0.3),
  },
  lockCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.08)',
  },
  lockText: {
    flex: 1,
    fontFamily: SANS_SEMIBOLD,
    fontSize: 13,
    color: TEXT_DIM(0.6),
  },
  empty: {
    fontFamily: SERIF,
    fontStyle: 'italic',
    fontSize: 16,
    color: TEXT_DIM(0.5),
    textAlign: 'center',
    marginTop: 60,
  },
});
