import { useAudioPlayer } from 'expo-audio';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text } from 'react-native';

import { canHearResidue } from '../../src/access';
import { Screen } from '../../src/components/Screen';
import { TapeButton } from '../../src/components/TapeButton';
import { findShown, gateOrigin, routeId, shownAt } from '../../src/data/residueIndex';
import { FALLBACK_ORIGIN, sampleAfterglowsNear } from '../../src/data/sampleAfterglows';
import { ACCESS_COPY } from '../../src/doctrine';
import { getCurrentCoord } from '../../src/location/permissions';
import { getAfterglow } from '../../src/storage/ephemeralStore';
import { color, font, glow } from '../../src/theme';
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
        <Text style={styles.body}>This whisper has already faded.</Text>
        <TapeButton label="Back" kind="quiet" onPress={() => router.back()} />
      </Screen>
    );
  }

  if (gateReady && !inRange) {
    return (
      <Screen>
        <Text style={styles.kicker}>same spot</Text>
        <Text style={styles.title}>at {item.placeHint}</Text>
        <Text style={styles.body}>{ACCESS_COPY.tooFar}</Text>
        <TapeButton label="Move on" kind="quiet" onPress={() => router.back()} />
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
        <Text style={styles.body}>A still was left here. Sample entries have no photo file.</Text>
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
      <TapeButton label="Move on" kind="quiet" onPress={() => router.back()} />
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
    marginBottom: 10,
    ...glow.text,
  },
  title: {
    color: color.ink,
    fontFamily: font.serif,
    fontSize: 28,
    marginBottom: 8,
    ...glow.text,
  },
  meta: {
    color: color.dust,
    fontFamily: font.mono,
    fontSize: 12,
    marginBottom: 20,
  },
  line: {
    color: color.ink,
    fontFamily: font.serif,
    fontSize: 24,
    lineHeight: 34,
    marginBottom: 24,
  },
  body: {
    color: color.dust,
    fontFamily: font.serif,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  still: {
    width: '100%',
    height: 280,
    backgroundColor: color.panel,
    marginBottom: 20,
  },
  note: {
    color: color.dust,
    fontFamily: font.serif,
    fontSize: 15,
    marginTop: 8,
    marginBottom: 20,
  },
});
