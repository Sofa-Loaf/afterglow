import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { lazy, Suspense, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '../src/components/Screen';
import { TapeButton } from '../src/components/TapeButton';
import { rememberOne } from '../src/data/residueIndex';
import { FALLBACK_ORIGIN } from '../src/data/sampleAfterglows';
import { CAPTURE, PROMPT } from '../src/doctrine';
import { getCurrentCoord } from '../src/location/permissions';
import { saveAfterglow } from '../src/storage/ephemeralStore';
import { color, font, panel, space, type } from '../src/theme';
import { expiresAt } from '../src/ttl';
import type { CaptureKind } from '../src/types';

const VoiceSection = lazy(() => import('../src/capture/VoiceSection'));

function newId(): string {
  return `local-${Date.now().toString(36)}`;
}

export default function CaptureScreen() {
  const router = useRouter();
  const [kind, setKind] = useState<CaptureKind | null>(null);
  const [line, setLine] = useState('');
  const [status, setStatus] = useState('Choose one. Then leave it.');
  const [busy, setBusy] = useState(false);

  async function persist(partial: {
    kind: CaptureKind;
    line?: string;
    mediaUri?: string;
    placeHint?: string;
  }) {
    const now = Date.now();
    const coord = (await getCurrentCoord()) ?? FALLBACK_ORIGIN;
    const item = {
      id: newId(),
      kind: partial.kind,
      createdAt: now,
      expiresAt: expiresAt(now),
      coord,
      line: partial.line,
      mediaUri: partial.mediaUri,
      origin: 'local' as const,
      placeHint: partial.placeHint ?? 'this place',
      plays: 0,
    };
    try {
      await saveAfterglow(item);
    } catch {
      // Local persist is best-effort.
    }
    rememberOne(item);
    router.replace('/');
  }

  async function takeStill() {
    setKind('still');
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        setStatus('Camera permission is needed for a still. A face is not required.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.7,
      });
      if (result.canceled || !result.assets[0]) {
        setStatus('No still kept.');
        return;
      }
      setBusy(true);
      await persist({ kind: 'still', mediaUri: result.assets[0].uri, placeHint: 'this place' });
    } catch {
      setStatus('Could not take a still.');
    }
  }

  async function leaveLine() {
    const trimmed = line.trim();
    if (!trimmed) {
      setStatus('One line. Then leave it.');
      return;
    }
    setBusy(true);
    await persist({ kind: 'line', line: trimmed.slice(0, CAPTURE.lineMaxChars) });
  }

  return (
    <Screen>
      <Text style={styles.kicker}>not a review</Text>
      <Text style={styles.title}>Leave a whisper</Text>
      <Text style={styles.body}>{status}</Text>

      {kind === null ? (
        <View style={styles.chooser}>
          <TapeButton
            label={`Record · ${CAPTURE.voiceMinSeconds}–${CAPTURE.voiceMaxSeconds}s`}
            onPress={() => setKind('voice')}
            disabled={busy}
          />
          <TapeButton label="A still · no face required" kind="ghost" onPress={() => void takeStill()} disabled={busy} />
          <TapeButton label="One line" kind="ghost" onPress={() => setKind('line')} disabled={busy} />
        </View>
      ) : null}

      {kind === 'voice' ? (
        <Suspense fallback={<Text style={styles.body}>Preparing the recorder…</Text>}>
          <VoiceSection
            busy={busy}
            onStatus={setStatus}
            onLeave={async (mediaUri) => {
              setBusy(true);
              await persist({ kind: 'voice', mediaUri, placeHint: 'this place' });
            }}
          />
        </Suspense>
      ) : null}

      {kind === 'line' ? (
        <View style={styles.panel}>
          <TextInput
            value={line}
            onChangeText={(value) => setLine(value.slice(0, CAPTURE.lineMaxChars))}
            placeholder="One line."
            placeholderTextColor={color.dust}
            maxLength={CAPTURE.lineMaxChars}
            style={styles.input}
            autoFocus
          />
          <Text style={styles.meta}>
            {line.trim().length}/{CAPTURE.lineMaxChars}
          </Text>
          <TapeButton label={PROMPT.leaveIt} onPress={() => void leaveLine()} disabled={busy} />
        </View>
      ) : null}

      <View style={styles.footer}>
        <TapeButton
          label={PROMPT.moveOn}
          kind="ghost"
          onPress={() => router.back()}
          disabled={busy}
        />
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
    marginBottom: space.sm,
  },
  body: {
    ...type.body,
    marginBottom: space.lg,
  },
  chooser: {
    marginBottom: 8,
  },
  panel: {
    ...panel,
    marginBottom: space.md,
  },
  input: {
    color: color.ink,
    fontFamily: font.serif,
    fontSize: 20,
    lineHeight: 28,
    borderBottomWidth: 1,
    borderBottomColor: color.tape,
    paddingVertical: 12,
    marginBottom: space.xs,
  },
  meta: {
    ...type.meta,
    marginBottom: space.md,
  },
  footer: {
    paddingTop: space.xl,
  },
});
