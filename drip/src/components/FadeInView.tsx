import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { Animated, type StyleProp, type ViewStyle } from 'react-native';

interface Props {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  duration?: number;
  rise?: number;
}

export function FadeInView({ children, style, duration = 420, rise = 10 }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    Animated.timing(progress, { toValue: 1, duration, useNativeDriver: true }).start();
  }, [duration, progress]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [rise, 0] }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
