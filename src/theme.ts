import { Platform } from 'react-native';

/** Dark field-recorder palette. Soft amber glow — never neon. */
export const color = {
  bg: '#0a0a0b',
  black: '#000000',
  panel: '#141416',
  ink: '#f3ead8',
  amber: '#c4a06a',
  amberSoft: '#d8b57a',
  amberGlow: 'rgba(196, 160, 106, 0.28)',
  dust: '#9a8d7a',
  line: '#2a2620',
  tape: '#6b5340',
} as const;

export const font = {
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' }),
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
} as const;

export const glow = {
  text: {
    textShadowColor: color.amberGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  panel: {
    shadowColor: color.amber,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
} as const;
