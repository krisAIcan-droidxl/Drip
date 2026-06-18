import { BlurView } from 'expo-blur';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HistoryNavIcon, HomeNavIcon, ProfileNavIcon, SavedNavIcon } from './Icons';
import { TEXT_DIM } from '@/src/theme/colors';
import { SANS } from '@/src/theme/fonts';

const ICONS = {
  index: HomeNavIcon,
  favorites: SavedNavIcon,
  history: HistoryNavIcon,
  profile: ProfileNavIcon,
} as const;

const LABELS: Record<string, string> = {
  index: 'Home',
  favorites: 'Saved',
  history: 'History',
  profile: 'Profile',
};

const ACTIVE = '#cdd8f5';
const INACTIVE = TEXT_DIM(0.4);

export function BottomNav({ state, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.bar}>
      <BlurView intensity={22} tint="dark" style={[StyleSheet.absoluteFill, styles.blur]} />
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const Icon = ICONS[route.name as keyof typeof ICONS];
        if (!Icon) return null;
        const color = focused ? ACTIVE : INACTIVE;

        return (
          <Pressable
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={styles.item}
            hitSlop={8}
          >
            <Icon size={22} color={color} />
            <Text style={[styles.label, { color }]}>{LABELS[route.name]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 24,
    height: 66,
    borderRadius: 24,
    backgroundColor: 'rgba(18,22,40,.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 16 },
    overflow: 'hidden',
  },
  blur: {
    borderRadius: 24,
  },
  item: {
    alignItems: 'center',
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  label: {
    fontSize: 10,
    fontFamily: SANS,
  },
});
