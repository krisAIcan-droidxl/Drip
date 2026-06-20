import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenBackground } from '@/src/components/ScreenBackground';
import { getDripById } from '@/src/features/drip/dripService';
import type { Drip } from '@/src/features/drip/dripTypes';
import { useDrip } from '@/src/features/drip/useDrip';
import { CATEGORY_ACCENT, TEXT_DIM } from '@/src/theme/colors';
import { SANS, SERIF, SERIF_ITALIC } from '@/src/theme/fonts';

export default function FavoritesScreen() {
  const favIds = useDrip((s) => s.favIds);
  const favorites = useMemo(
    () => favIds.map((id) => getDripById(id)).filter((d): d is Drip => Boolean(d)),
    [favIds]
  );

  return (
    <ScreenBackground>
      <View style={styles.root}>
        <View style={styles.header}>
          <Text style={styles.title}>Saved</Text>
          <Text style={styles.count}>{favorites.length} drips</Text>
        </View>

        {favorites.length === 0 ? (
          <Text style={styles.empty}>Everything you keep will live here.</Text>
        ) : (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            {favorites.map((d) => {
              const accent = CATEGORY_ACCENT[d.category];
              return (
                <View key={d.id} style={[styles.card, { borderColor: 'rgba(255,255,255,.09)' }]}>
                  <View style={[styles.cardBar, { backgroundColor: accent }]} />
                  <View style={styles.cardHead}>
                    <View style={[styles.dot, { backgroundColor: accent }]} />
                    <Text style={styles.cardCategory}>{d.category}</Text>
                  </View>
                  <Text style={styles.cardText}>{d.text}</Text>
                  {d.author ? <Text style={styles.cardAuthor}>— {d.author}</Text> : null}
                </View>
              );
            })}
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
    gap: 12,
    paddingBottom: 110,
  },
  card: {
    position: 'relative',
    borderRadius: 20,
    padding: 18,
    paddingLeft: 20,
    backgroundColor: 'rgba(255,255,255,.05)',
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 3,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 9,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  cardCategory: {
    fontFamily: SANS,
    fontWeight: '600',
    fontSize: 10,
    letterSpacing: 1.6,
    color: TEXT_DIM(0.5),
  },
  cardText: {
    fontFamily: SERIF,
    fontSize: 18,
    lineHeight: 25,
    color: '#e9edf8',
  },
  cardAuthor: {
    fontFamily: SERIF_ITALIC,
    fontSize: 14,
    color: TEXT_DIM(0.6),
    marginTop: 8,
  },
  empty: {
    fontFamily: SERIF_ITALIC,
    fontSize: 16,
    color: TEXT_DIM(0.5),
    textAlign: 'center',
    marginTop: 60,
  },
});
