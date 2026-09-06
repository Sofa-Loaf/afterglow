import { Pressable, StyleSheet, Text } from 'react-native';

import { color, font, glow } from '../theme';

type Props = {
  label: string;
  onPress: () => void;
  kind?: 'primary' | 'quiet';
  disabled?: boolean;
};

export function TapeButton({ label, onPress, kind = 'primary', disabled }: Props) {
  const primary = kind !== 'quiet';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        primary ? styles.primary : styles.quiet,
        primary && glow.panel,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.label, !primary && styles.quietLabel, primary && glow.text]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  primary: {
    backgroundColor: color.panel,
    borderColor: color.amber,
  },
  quiet: {
    backgroundColor: 'transparent',
    borderColor: color.line,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    color: color.ink,
    fontFamily: font.serif,
    fontSize: 17,
    textAlign: 'center',
  },
  quietLabel: {
    color: color.dust,
  },
});
