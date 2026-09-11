import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { residueInReach } from '../src/access';
import { Screen } from '../src/components/Screen';
import { TapeButton } from '../src/components/TapeButton';
import { Wordmark } from '../src/components/Wordmark';
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
import { color, font, panel, space, type } from '../src/theme';
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
      <Wordmark size="hero" />
      <Text style={styles.kicker}>whispers nearby</Text>
      <Text style={styles.tagline}>Whispers left where you stood.</Text>
      <Text style={styles.lede}>Hear one only at the same pin — {ACCESS_COPY.radius}. Then move on.</Text>

      {permission !== 'granted' ? (
        <View style={styles.panel}>
          <Text style={styles.panelText}>
            GPS is the trigger. Location stays on-device. Residue within {ACCESS_COPY.radius} of the
            pin. No live “who’s here.”
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
          {here ? 'At this pin' : 'Using sample coordinates'} · {ACCESS_COPY.radiusShort}
        </Text>
      )}

      {items.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.empty}>{ACCESS_COPY.emptyNearby}</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {items.map((item) => {
            const distance = formatDistance(distanceMeters(origin, item.coord));
            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                onPress={() => router.push(`/residue/${item.id}`)}
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
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
        </View>
      )}

      <View style={styles.actions}>
        <TapeButton label={PROMPT.leave} onPress={() => router.push('/leave')} />
        <TapeButton label="Leave one now" kind="ghost" onPress={() => router.push('/capture')} />
        <Pressable
          accessibilityRole="link"
          onPress={() => router.push('/privacy')}
          hitSlop={8}
          style={styles.privacyHit}
        >
          <Text style={styles.privacy}>Privacy</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    ...type.kicker,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: space.sm,
  },
  tagline: {
    ...type.title,
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
    marginBottom: space.sm,
  },
  lede: {
    ...type.body,
    textAlign: 'center',
    marginBottom: space.lg,
  },
  meta: {
    ...type.meta,
    textAlign: 'center',
    marginBottom: space.lg,
  },
  panel: {
    ...panel,
    marginBottom: space.lg,
  },
  panelText: {
    ...type.body,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: space.sm,
  },
  list: {
    marginBottom: 8,
  },
  row: {
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.line,
  },
  rowPressed: {
    opacity: 0.72,
  },
  rowKind: {
    color: color.amberSoft,
    fontFamily: font.mono,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  rowBody: {
    color: color.ink,
    fontFamily: font.serif,
    fontSize: 18,
    lineHeight: 26,
  },
  rowMeta: {
    ...type.meta,
    marginTop: 8,
  },
  emptyBox: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: color.line,
    paddingVertical: 28,
    marginBottom: space.lg,
  },
  empty: {
    ...type.body,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actions: {
    marginTop: 'auto',
    paddingTop: space.xl,
  },
  privacyHit: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  privacy: {
    ...type.meta,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: color.dust,
  },
});
