import { Pressable, StyleSheet, Text, View } from 'react-native';

import { color, font, glow } from '../theme';

type Props = {
  label: string;
  onPress: () => void;
  /** Primary = amber tape action. Ghost = quiet secondary. */
  kind?: 'primary' | 'ghost' | 'quiet';
  disabled?: boolean;
};

export function TapeButton({ label, onPress, kind = 'primary', disabled }: Props) {
  const primary = kind === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled) }}
      onPress={onPress}
      disabled={disabled}
      hitSlop={4}
      style={({ pressed }) => [
        styles.base,
        primary ? styles.primary : styles.ghost,
        primary && glow.panel,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <View style={styles.row}>
        {primary ? <View style={styles.reel} /> : <View style={styles.reelSpacer} />}
        <Text
          style={[styles.label, !primary && styles.ghostLabel, primary && glow.text]}
          numberOfLines={2}
        >
          {label}
        </Text>
        {primary ? <View style={styles.reel} /> : <View style={styles.reelSpacer} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: color.amberMuted,
    borderColor: color.amber,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: color.line,
  },
  pressed: {
    opacity: 0.82,
  },
  disabled: {
    opacity: 0.38,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  reel: {
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: color.amber,
    backgroundColor: 'transparent',
  },
  reelSpacer: {
    width: 9,
    height: 9,
  },
  label: {
    flexShrink: 1,
    color: color.ink,
    fontFamily: font.serif,
    fontSize: 17,
    lineHeight: 22,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  ghostLabel: {
    color: color.dust,
  },
});
