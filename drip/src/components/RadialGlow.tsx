import { useRef } from 'react';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

let glowSeq = 0;

interface Props {
  width: number;
  height?: number;
  color: string;
  opacity?: number;
}

// Soft radial fade-to-transparent glow, standing in for the design's
// `radial-gradient(...) + filter: blur(30px)` — a flat-color circle with
// opacity reads as a hard-edged disc instead of an ambient glow.
export function RadialGlow({ width, height = width, color, opacity = 0.6 }: Props) {
  const id = useRef(`glow${++glowSeq}`).current;
  return (
    <Svg width={width} height={height} pointerEvents="none">
      <Defs>
        <RadialGradient id={id} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={color} stopOpacity={opacity} />
          <Stop offset="1" stopColor={color} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse cx={width / 2} cy={height / 2} rx={width / 2} ry={height / 2} fill={`url(#${id})`} />
    </Svg>
  );
}
