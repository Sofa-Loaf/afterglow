import { Platform, TextStyle, ViewStyle } from 'react-native';

/** Dark field-recorder palette. Soft amber glow — never neon. */
export const color = {
  bg: '#0a0a0b',
  black: '#000000',
  panel: '#12110f',
  ink: '#f4ead8',
  amber: '#c4a06a',
  amberSoft: '#d4b484',
  amberMuted: 'rgba(196, 160, 106, 0.14)',
  amberGlow: 'rgba(196, 160, 106, 0.22)',
  dust: '#8c8070',
  line: '#3a3228',
  tape: '#6b5340',
} as const;

export const font = {
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' }),
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
} as const;

export const space = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 36,
  screenX: 24,
} as const;

export const glow = {
  text: {
    textShadowColor: color.amberGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  panel: {
    shadowColor: color.amber,
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },
} as const;

export const type = {
  kicker: {
    color: color.amberSoft,
    fontFamily: font.mono,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    ...glow.text,
  } as TextStyle,
  title: {
    color: color.ink,
    fontFamily: font.serif,
    fontSize: 28,
    lineHeight: 36,
    ...glow.text,
  } as TextStyle,
  display: {
    color: color.ink,
    fontFamily: font.serif,
    fontSize: 32,
    lineHeight: 40,
    ...glow.text,
  } as TextStyle,
  body: {
    color: color.dust,
    fontFamily: font.serif,
    fontSize: 16,
    lineHeight: 25,
  } as TextStyle,
  meta: {
    color: color.dust,
    fontFamily: font.mono,
    fontSize: 12,
    lineHeight: 18,
  } as TextStyle,
} as const;

export const panel: ViewStyle = {
  borderWidth: 1,
  borderColor: color.line,
  backgroundColor: color.panel,
  paddingVertical: 18,
  paddingHorizontal: 16,
};
