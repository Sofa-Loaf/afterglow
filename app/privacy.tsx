import { Linking, StyleSheet, Text } from 'react-native';

import { Screen } from '../src/components/Screen';
import { DOCTRINE_LINES, PRODUCT } from '../src/doctrine';
import { storageNote } from '../src/storage/ephemeralStore';
import { space, type } from '../src/theme';

const POLICY_URL = 'https://28to3.me/apps/afterglow.html#privacy';

export default function PrivacyScreen() {
  return (
    <Screen>
      <Text style={styles.kicker}>{PRODUCT.name}</Text>
      <Text style={styles.title}>Quiet by default</Text>
      <Text style={styles.line}>
        Afterglow is free. There is no account and no Stripe. Location, microphone, and photos stay
        on this device for the feature you chose. They are not sold.
      </Text>
      {DOCTRINE_LINES.map((line) => (
        <Text key={line} style={styles.line}>
          {line}
        </Text>
      ))}
      <Text style={styles.heading}>What this build uses</Text>
      <Text style={styles.line}>{storageNote}</Text>
      <Text style={styles.line}>
        Precise GPS (foreground only) notices when you leave and gates listening to about fifty
        feet (~15 m) of the pin. The microphone records an 8–12 second voice note only after you
        start. The camera or a photo you pick is only for a still you choose. A face is not
        required.
      </Text>
      <Text style={styles.line}>
        Background location is off. There is no live “who’s here,” no feed, and no ads SDK.
      </Text>
      <Text
        style={styles.link}
        accessibilityRole="link"
        onPress={() => {
          void Linking.openURL(POLICY_URL);
        }}
      >
        Full policy on 28to3.me
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    ...type.kicker,
    marginBottom: space.sm,
  },
  title: {
    ...type.title,
    marginBottom: space.lg,
  },
  heading: {
    ...type.title,
    fontSize: 20,
    lineHeight: 26,
    marginTop: space.sm,
    marginBottom: space.sm,
  },
  line: {
    ...type.body,
    marginBottom: space.sm,
  },
  link: {
    color: type.kicker.color,
    fontFamily: type.body.fontFamily,
    fontSize: 16,
    marginTop: space.sm,
    textDecorationLine: 'underline',
  },
});
