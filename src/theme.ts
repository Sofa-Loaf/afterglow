import { Platform } from 'react-native';

export const color = {
  bg: '#14110e',
  panel: '#221c16',
  ink: '#efe6d6',
  amber: '#d4a574',
  dust: '#8a7d6b',
  line: '#3a3228',
  tape: '#6b5340',
} as const;

export const font = {
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' }),
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
} as const;
