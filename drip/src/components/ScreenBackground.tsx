import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { BG_GRADIENT, BG_GRADIENT_LOCATIONS } from '@/src/theme/colors';

export function ScreenBackground({ children }: { children: ReactNode }) {
  return (
    <View style={styles.root}>
      <LinearGradient colors={BG_GRADIENT} locations={BG_GRADIENT_LOCATIONS} style={StyleSheet.absoluteFill} />
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <RadialGradient id="orbBlue" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#7896eb" stopOpacity={0.3} />
            <Stop offset="1" stopColor="#7896eb" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="orbPurple" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#9678dc" stopOpacity={0.24} />
            <Stop offset="1" stopColor="#9678dc" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="orbBottomWash" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#7896eb" stopOpacity={0.1} />
            <Stop offset="1" stopColor="#7896eb" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx="12%" cy="-2%" r={230} fill="url(#orbBlue)" />
        <Circle cx="94%" cy="88%" r={210} fill="url(#orbPurple)" />
        <Circle cx="50%" cy="120%" r={320} fill="url(#orbBottomWash)" />
      </Svg>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#080b16',
  },
});
