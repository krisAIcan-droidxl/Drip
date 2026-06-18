// Background gradient stops, lifted from the DripScreen design
// (radial-gradient(125% 78% at 50% -8%, #1c2444 0%, #0d1224 52%, #080b16 100%))
export const BG_GRADIENT = ['#1c2444', '#0d1224', '#080b16'] as const;
export const BG_GRADIENT_LOCATIONS = [0, 0.52, 1] as const;

export const TEXT = '#eef1f8';
export const TEXT_DIM = (alpha: number) => hexToRgba('#eef1f8', alpha);

export const GOLD = '#f4b860';
export const GOLD_DARK = '#2a1c04';

export const GLASS_BG = 'rgba(255,255,255,.05)';
export const GLASS_BG_STRONG = 'rgba(255,255,255,.06)';
export const GLASS_BORDER = 'rgba(255,255,255,.1)';

export const ORB_BLUE = 'rgba(120,150,235,.30)';
export const ORB_PURPLE = 'rgba(150,120,220,.24)';

export const LIGHT_BUTTON_GRADIENT = ['#eef2ff', '#cdd8f5'] as const;
export const GOLD_BUTTON_GRADIENT = ['#f7e3bf', '#f4b860'] as const;
export const DROPLET_GRADIENT = ['#dbe5ff', '#8ea7ec'] as const;

export type DripCategory =
  | 'QUOTE'
  | 'CHALLENGE'
  | 'REFLECTION'
  | 'QUESTION'
  | 'FACT'
  | 'INSIGHT';

// Converted from the design's oklch(0.80 ...) category accents to sRGB hex,
// since React Native doesn't support the oklch() color function.
export const CATEGORY_ACCENT: Record<DripCategory, string> = {
  QUOTE: '#b1b9f1',
  CHALLENGE: '#eaaba5',
  REFLECTION: '#8ccdbe',
  QUESTION: '#85c8e6',
  FACT: '#97c2f0',
  INSIGHT: '#cab1e8',
};

export const CATEGORY_PROMPT: Record<DripCategory, string> = {
  QUESTION: 'Sit with this',
  CHALLENGE: 'Your move today',
  REFLECTION: 'Notice this',
  FACT: 'Did you know',
  INSIGHT: 'Worth remembering',
  QUOTE: 'Words to keep',
};

export const ONBOARDING_ACCENTS = ['#97c1f7', '#cbafed', '#7fcfc4'] as const;

export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
