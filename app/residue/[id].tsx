import { useAudioPlayer } from 'expo-audio';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { canHearResidue } from '../../src/access';
import { Screen } from '../../src/components/Screen';
import { TapeButton } from '../../src/components/TapeButton';
import { findShown, gateOrigin, routeId, shownAt } from '../../src/data/residueIndex';
import { FALLBACK_ORIGIN, sampleAfterglowsNear } from '../../src/data/sampleAfterglows';
import { ACCESS_COPY } from '../../src/doctrine';
import { getCurrentCoord } from '../../src/location/permissions';
import { getAfterglow } from '../../src/storage/ephemeralStore';
import { color, panel, space, type } from '../../src/theme';
import { ageLabel } from '../../src/ttl';
import type { Afterglow, Coord } from '../../src/types';

export default function ResidueScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = routeId(params.id);
  const router = useRouter();
  const [item, setItem] = useState<Afterglow | null>(() => findShown(id));
  const [here, setHere] = useState<Coord | null>(null);
  const [gateReady, setGateReady] = useState(false);
  const player = useAudioPlayer(item?.kind === 'voice' ? item.mediaUri : undefined);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cached = findShown(id);
      const local = id ? await getAfterglow(id) : null;
      const sample = sampleAfterglowsNear(FALLBACK_ORIGIN).find((entry) => entry.id === id) ?? null;
      const coord = await getCurrentCoord();
      if (!cancelled) {
        setItem(cached ?? local ?? sample);
        setHere(coord);
        setGateReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const origin = gateOrigin(here, FALLBACK_ORIGIN);
  const inRange = item ? canHearResidue(origin, item.coord, shownAt()) : false;

  if (!item) {
    return (
      <Screen>
        <Text style={styles.kicker}>faded</Text>
        <Text style={styles.title}>This whisper has already faded.</Text>
        <View style={styles.footer}>
          <TapeButton label="Back" kind="ghost" onPress={() => router.back()} />
        </View>
      </Screen>
    );
  }

  if (gateReady && !inRange) {
    return (
      <Screen>
        <Text style={styles.kicker}>same spot</Text>
        <Text style={styles.title}>at {item.placeHint}</Text>
        <View style={styles.emptyBox}>
          <Text style={styles.body}>{ACCESS_COPY.tooFar}</Text>
        </View>
        <View style={styles.footer}>
          <TapeButton label="Move on" kind="ghost" onPress={() => router.back()} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.kicker}>{item.origin === 'sample' ? 'sample whisper' : 'your whisper'}</Text>
      <Text style={styles.title}>at {item.placeHint}</Text>
      <Text style={styles.meta}>{ageLabel(item.createdAt)} · fades on its own</Text>

      {item.kind === 'line' ? (
        <Text style={styles.line}>{item.line || 'A line was left here.'}</Text>
      ) : null}

      {item.kind === 'still' && item.mediaUri ? (
        <Image source={{ uri: item.mediaUri }} style={styles.still} accessibilityLabel="Still afterglow" />
      ) : null}

      {item.kind === 'still' && !item.mediaUri ? (
        <View style={styles.emptyBox}>
          <Text style={styles.body}>A still was left here. Sample entries have no photo file.</Text>
        </View>
      ) : null}

      {item.kind === 'voice' ? (
        <>
          <Text style={styles.body}>
            {item.mediaUri
              ? 'A short voice from who stood right here. Play it once, then move on.'
              : 'A voice was left here. Sample entries have no recording file.'}
          </Text>
          {item.mediaUri ? (
            <TapeButton
              label="Listen"
              onPress={() => {
                player.seekTo(0);
                player.play();
              }}
            />
          ) : null}
        </>
      ) : null}

      <Text style={styles.note}>No comments. No likes. No stars. Leave it as you found it.</Text>
      <View style={styles.footer}>
        <TapeButton label="Move on" kind="ghost" onPress={() => router.back()} />
      </View>
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
    marginBottom: space.xs,
  },
  meta: {
    ...type.meta,
    marginBottom: space.lg,
  },
  line: {
    color: color.ink,
    fontFamily: type.title.fontFamily,
    fontSize: 24,
    lineHeight: 34,
    marginBottom: space.lg,
  },
  body: {
    ...type.body,
    marginBottom: space.md,
  },
  still: {
    width: '100%',
    height: 280,
    backgroundColor: color.panel,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.line,
    marginBottom: space.lg,
  },
  emptyBox: {
    ...panel,
    marginBottom: space.md,
  },
  note: {
    ...type.body,
    fontSize: 15,
    marginTop: space.sm,
    marginBottom: space.md,
  },
  footer: {
    paddingTop: space.xl,
  },
});
