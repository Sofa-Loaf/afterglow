import { Pressable, StyleSheet, Text, View } from 'react-native';

import { color, font, space, type } from '../theme';

type Props = {
  message: string;
  onRetry: () => void;
};

/** Visible fallback when JS throws in production (no redbox). */
export function CrashScreen({ message, onRetry }: Props) {
  return (
    <View style={styles.root}>
      <Text style={styles.kicker}>afterglow</Text>
      <Text style={styles.title}>Something went quiet.</Text>
      <Text style={styles.body}>
        The field recorder hit an error instead of closing. You can retry, or send this line:
      </Text>
      <Text style={styles.message} selectable>
        {message}
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={onRetry}
        style={({ pressed }) => [styles.retry, pressed && styles.pressed]}
      >
        <Text style={styles.retryLabel}>Retry</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: color.bg,
    justifyContent: 'center',
    paddingHorizontal: space.screenX,
    paddingVertical: space.xl,
  },
  kicker: {
    ...type.kicker,
    marginBottom: space.sm,
  },
  title: {
    ...type.title,
    marginBottom: space.md,
  },
  body: {
    ...type.body,
    marginBottom: space.md,
  },
  message: {
    color: color.amberSoft,
    fontFamily: font.mono,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: space.xl,
  },
  retry: {
    borderWidth: 1,
    borderColor: color.amber,
    backgroundColor: color.amberMuted,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  pressed: {
    opacity: 0.82,
  },
  retryLabel: {
    color: color.ink,
    fontFamily: font.serif,
    fontSize: 17,
  },
});
