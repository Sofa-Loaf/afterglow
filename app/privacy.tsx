import { StyleSheet, Text } from 'react-native';

import { Screen } from '../src/components/Screen';
import { DOCTRINE_LINES, PRODUCT } from '../src/doctrine';
import { storageNote } from '../src/storage/ephemeralStore';
import { color, font } from '../src/theme';

export default function PrivacyScreen() {
  return (
    <Screen>
      <Text style={styles.kicker}>{PRODUCT.name}</Text>
      <Text style={styles.title}>Quiet by default</Text>
      {DOCTRINE_LINES.map((line) => (
        <Text key={line} style={styles.line}>
          {line}
        </Text>
      ))}
      <Text style={styles.line}>{storageNote}</Text>
      <Text style={styles.line}>
        v0 asks for foreground GPS (leave detection and the fifty-foot gate), microphone (voice),
        and camera (still). Background location is off. There is no account, no Stripe, and no live
        presence.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    color: color.amber,
    fontFamily: font.mono,
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  title: {
    color: color.ink,
    fontFamily: font.serif,
    fontSize: 28,
    marginBottom: 18,
  },
  line: {
    color: color.dust,
    fontFamily: font.serif,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
});
