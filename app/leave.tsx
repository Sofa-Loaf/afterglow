import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Screen } from '../src/components/Screen';
import { TapeButton } from '../src/components/TapeButton';
import { FALLBACK_ORIGIN } from '../src/data/sampleAfterglows';
import { ACCESS_COPY, PROMPT } from '../src/doctrine';
import { reduceLeaveState, resetLeaveState } from '../src/location/leaveDetection';
import { color, font, glow } from '../src/theme';

export default function LeaveScreen() {
  const router = useRouter();
  const [simulated, setSimulated] = useState(false);

  const state = useMemo(() => {
    let next = reduceLeaveState(resetLeaveState(), FALLBACK_ORIGIN);
    if (simulated) {
      next = reduceLeaveState(next, FALLBACK_ORIGIN, { simulateLeave: true });
    }
    return next;
  }, [simulated]);

  return (
    <Screen>
      <Text style={styles.kicker}>after you leave</Text>
      <Text style={styles.prompt}>{PROMPT.leave}</Text>
      <Text style={styles.body}>
        GPS noticed you left. A voice of 8–12 seconds. A still — no face required. Or one line. A
        whisper from who stood right there. Not a review. Then you move on.
      </Text>
      <Text style={styles.meta}>
        Leave detection uses GPS in the foreground. The pin is precise; {ACCESS_COPY.radius} is the
        gate. Background geofencing is off so Play does not need background location. Phase:{' '}
        {state.phase}.
      </Text>
      {!simulated ? (
        <TapeButton label="Simulate leaving" kind="quiet" onPress={() => setSimulated(true)} />
      ) : null}
      <TapeButton label={PROMPT.leaveIt} onPress={() => router.push('/capture')} />
      <TapeButton label={PROMPT.moveOn} kind="quiet" onPress={() => router.replace('/')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    color: color.amberSoft,
    fontFamily: font.mono,
    fontSize: 12,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: 14,
    ...glow.text,
  },
  prompt: {
    color: color.ink,
    fontFamily: font.serif,
    fontSize: 32,
    lineHeight: 40,
    marginBottom: 16,
    ...glow.text,
  },
  body: {
    color: color.dust,
    fontFamily: font.serif,
    fontSize: 17,
    lineHeight: 26,
    marginBottom: 18,
  },
  meta: {
    color: color.dust,
    fontFamily: font.mono,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 28,
  },
});
