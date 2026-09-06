import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { residueInReach } from '../src/access';
import { Screen } from '../src/components/Screen';
import { TapeButton } from '../src/components/TapeButton';
import { rememberShown } from '../src/data/residueIndex';
import { FALLBACK_ORIGIN, sampleAfterglowsNear } from '../src/data/sampleAfterglows';
import { ACCESS_COPY, PROMPT } from '../src/doctrine';
import { distanceMeters, formatDistance } from '../src/geo';
import {
  getCurrentCoord,
  getForegroundPermission,
  requestForegroundPermission,
} from '../src/location/permissions';
import { listLocalAfterglows } from '../src/storage/ephemeralStore';
import { color, font } from '../src/theme';
import { ageLabel } from '../src/ttl';
import type { Afterglow, Coord, PermissionState } from '../src/types';

function kindLabel(kind: Afterglow['kind']): string {
  if (kind === 'voice') return 'voice';
  if (kind === 'still') return 'still';
  return 'a line';
}

export default function FieldScreen() {
  const router = useRouter();
  const [permission, setPermission] = useState<PermissionState>('unknown');
  const [here, setHere] = useState<Coord | null>(null);
  const [items, setItems] = useState<Afterglow[]>([]);

  const refresh = useCallback(async () => {
    const status = await getForegroundPermission();
    setPermission(status);
    const coord = status === 'granted' ? await getCurrentCoord() : null;
    const origin = coord ?? FALLBACK_ORIGIN;
    setHere(coord);
    const local = await listLocalAfterglows();
    const nearby = residueInReach([...local, ...sampleAfterglowsNear(origin)], origin).sort(
      (a, b) => b.createdAt - a.createdAt,
    );
    rememberShown(nearby, origin);
    setItems(nearby);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const origin = here ?? FALLBACK_ORIGIN;

  return (
    <Screen>
      <Text style={styles.kicker}>whispers nearby</Text>
      <Text style={styles.lede}>
        Whispers from who stood right here. Not a review of the place. You have to be at the same
        spot — {ACCESS_COPY.radius}.
      </Text>

      {permission !== 'granted' ? (
        <View style={styles.panel}>
          <Text style={styles.panelText}>
            GPS is the trigger. Location stays on-device. Afterglow notices when you leave, and only
            shows residue within {ACCESS_COPY.radius} of the pin. No live “who’s here.”
          </Text>
          <TapeButton
            label="Allow location"
            onPress={async () => {
              await requestForegroundPermission();
              await refresh();
            }}
          />
        </View>
      ) : (
        <Text style={styles.meta}>
          {here ? 'At this pin' : 'Using sample coordinates'} · {ACCESS_COPY.radiusShort} ·
          foreground only
        </Text>
      )}

      {items.length === 0 ? (
        <Text style={styles.empty}>{ACCESS_COPY.emptyNearby}</Text>
      ) : null}

      {items.map((item) => {
        const distance = formatDistance(distanceMeters(origin, item.coord));
        return (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            onPress={() => router.push(`/residue/${item.id}`)}
            style={styles.row}
          >
            <Text style={styles.rowKind}>{kindLabel(item.kind)}</Text>
            <Text style={styles.rowBody}>
              {item.kind === 'line' && item.line ? item.line : `at ${item.placeHint}`}
            </Text>
            <Text style={styles.rowMeta}>
              {ageLabel(item.createdAt)} · {distance}
              {item.origin === 'sample' ? ' · sample' : ''}
            </Text>
          </Pressable>
        );
      })}

      <View style={styles.spacer} />
      <TapeButton label={PROMPT.leave} onPress={() => router.push('/leave')} />
      <TapeButton label="Leave one now" kind="quiet" onPress={() => router.push('/capture')} />
      <TapeButton label="Privacy" kind="quiet" onPress={() => router.push('/privacy')} />
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
  lede: {
    color: color.ink,
    fontFamily: font.serif,
    fontSize: 22,
    lineHeight: 30,
    marginBottom: 18,
  },
  meta: {
    color: color.dust,
    fontFamily: font.mono,
    fontSize: 12,
    marginBottom: 16,
  },
  panel: {
    borderWidth: 1,
    borderColor: color.line,
    backgroundColor: color.panel,
    padding: 16,
    marginBottom: 18,
  },
  panelText: {
    color: color.dust,
    fontFamily: font.serif,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: color.line,
    paddingVertical: 14,
  },
  rowKind: {
    color: color.amber,
    fontFamily: font.mono,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  rowBody: {
    color: color.ink,
    fontFamily: font.serif,
    fontSize: 18,
    lineHeight: 24,
  },
  rowMeta: {
    color: color.dust,
    fontFamily: font.mono,
    fontSize: 12,
    marginTop: 6,
  },
  empty: {
    color: color.dust,
    fontFamily: font.serif,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 18,
    fontStyle: 'italic',
  },
  spacer: {
    height: 28,
  },
});
