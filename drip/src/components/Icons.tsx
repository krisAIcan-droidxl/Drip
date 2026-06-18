import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export function FlameIcon({ size = 15, color = '#f4b860' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3c.5 3-2 4-2 7a2 2 0 0 0 4 0c2 2 3 3 3 6a5 5 0 0 1-10 0c0-4 3-5 5-13Z"
        fill={color}
      />
    </Svg>
  );
}

export function BackArrowIcon({ size = 18, color = '#eef1f8' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 5l-7 7 7 7"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CloseIcon({ size = 16, color = '#eef1f8' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

export function HeartIcon({ size = 20, filled, color = 'rgba(238,241,248,.6)' }: IconProps & { filled?: string | null }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ?? 'none'}>
      <Path
        d="M12 20.5l-1.4-1.3C5.6 14.7 3 12.3 3 9.2 3 6.8 4.9 5 7.2 5c1.5 0 2.9.7 3.8 1.9C11.9 5.7 13.3 5 14.8 5 17.1 5 19 6.8 19 9.2c0 3.1-2.6 5.5-7.6 10z"
        stroke={filled ?? color}
        strokeWidth={1.6}
      />
    </Svg>
  );
}

export function ShareIcon({ size = 19, color = '#12162a' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 15V4m0 0L8.5 7.5M12 4l3.5 3.5M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function DiamondIcon({ size = 42, color = '#f4b860' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 8l4 4 4-7 4 7 4-4-1.6 11H5.6L4 8Z"
        fill={color}
        stroke={color}
        strokeWidth={1}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CheckIcon({ size = 13, color = '#9db4f0' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12l4 4 10-10" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function LockIcon({ size = 13, color = 'rgba(238,241,248,.42)' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="11" width="14" height="9" rx="2" stroke={color} strokeWidth={1.7} />
      <Path d="M8 11V8a4 4 0 0 1 8 0v3" stroke={color} strokeWidth={1.7} />
    </Svg>
  );
}

export function HomeNavIcon({ size = 22, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 11l8-6 8 6v7a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1v-7Z"
        stroke={color}
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function SavedNavIcon({ size = 22, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 20.5l-1.4-1.3C5.6 14.7 3 12.3 3 9.2 3 6.8 4.9 5 7.2 5c1.5 0 2.9.7 3.8 1.9C11.9 5.7 13.3 5 14.8 5 17.1 5 19 6.8 19 9.2c0 3.1-2.6 5.5-7.6 10z"
        stroke={color}
        strokeWidth={1.7}
      />
    </Svg>
  );
}

export function HistoryNavIcon({ size = 22, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={8} stroke={color} strokeWidth={1.7} />
      <Path d="M12 8v4.4l3 1.8" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

export function ProfileNavIcon({ size = 22, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8.5} r={3.4} stroke={color} strokeWidth={1.7} />
      <Path d="M5.5 19c.6-3.2 3.2-5 6.5-5s5.9 1.8 6.5 5" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

export function WifiBatteryGlyphs() {
  return null;
}

export function DropletSeal({ size = 13, color = 'rgba(238,241,248,.5)' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2.2C12 2.2 5 10.4 5 15.4a7 7 0 0 0 14 0c0-5-7-13.2-7-13.2Z" fill={color} />
      <Ellipse cx={9.6} cy={13.4} rx={1.7} ry={2.4} fill="#ffffff" opacity={0.55} />
    </Svg>
  );
}
