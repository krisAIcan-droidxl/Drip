import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
  gradient?: boolean;
}

export function DropletIcon({ size = 24, color = '#eef2ff', gradient = false }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {gradient && (
        <Defs>
          <LinearGradient id="dropG" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#dbe5ff" />
            <Stop offset="1" stopColor="#8ea7ec" />
          </LinearGradient>
        </Defs>
      )}
      <Path
        d="M12 2.2C12 2.2 5 10.4 5 15.4a7 7 0 0 0 14 0c0-5-7-13.2-7-13.2Z"
        fill={gradient ? 'url(#dropG)' : color}
      />
    </Svg>
  );
}
