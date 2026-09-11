import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '../src/components/Screen';
import { TapeButton } from '../src/components/TapeButton';
import { FALLBACK_ORIGIN } from '../src/data/sampleAfterglows';
import { ACCESS_COPY, PROMPT } from '../src/doctrine';
import { reduceLeaveState, resetLeaveState } from '../src/location/leaveDetection';
import { space, type } from '../src/theme';

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
        A voice of 8–12 seconds. A still — no face required. Or one line. Then you move on.
      </Text>
      <Text style={styles.meta}>
        GPS in the foreground. The pin is precise; {ACCESS_COPY.radius} is the gate. Phase:{' '}
        {state.phase}.
      </Text>
      <View style={styles.actions}>
        {!simulated ? (
          <TapeButton label="Simulate leaving" kind="ghost" onPress={() => setSimulated(true)} />
        ) : null}
        <TapeButton label={PROMPT.leaveIt} onPress={() => router.push('/capture')} />
        <TapeButton label={PROMPT.moveOn} kind="ghost" onPress={() => router.replace('/')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    ...type.kicker,
    marginBottom: space.md,
  },
  prompt: {
    ...type.display,
    marginBottom: space.md,
  },
  body: {
    ...type.body,
    fontSize: 17,
    lineHeight: 26,
    marginBottom: space.md,
  },
  meta: {
    ...type.meta,
    marginBottom: space.xl,
  },
  actions: {
    marginTop: 'auto',
  },
});
