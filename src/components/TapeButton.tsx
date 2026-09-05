import { Pressable, StyleSheet, Text } from 'react-native';

import { color, font } from '../theme';

type Props = {
  label: string;
  onPress: () => void;
  kind?: 'primary' | 'quiet';
  disabled?: boolean;
};

export function TapeButton({ label, onPress, kind = 'primary', disabled }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        kind === 'quiet' ? styles.quiet : styles.primary,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.label, kind === 'quiet' && styles.quietLabel]}>{label}</Text>
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
