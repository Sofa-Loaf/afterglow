import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
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

function newId(): string {
  return `local-${Date.now().toString(36)}`;
}

export default function CaptureScreen() {
  const router = useRouter();
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder, 200);
  const [kind, setKind] = useState<CaptureKind | null>(null);
  const [line, setLine] = useState('');
  const [status, setStatus] = useState('Choose one. Then leave it.');
  const [busy, setBusy] = useState(false);
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (stopTimer.current) clearTimeout(stopTimer.current);
    };
  }, []);

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
    await saveAfterglow(item);
    rememberOne(item);
    router.replace('/');
  }

  async function startVoice() {
    setKind('voice');
    const permission = await AudioModule.requestRecordingPermissionsAsync();
    if (!permission.granted) {
      setStatus('Microphone permission is needed for a voice note.');
      return;
    }
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
    setStatus(`Recording. Keep it between ${CAPTURE.voiceMinSeconds}–${CAPTURE.voiceMaxSeconds}s.`);
    stopTimer.current = setTimeout(() => {
      void finishVoice();
    }, CAPTURE.voiceMaxSeconds * 1000);
  }

  async function finishVoice() {
    if (stopTimer.current) {
      clearTimeout(stopTimer.current);
      stopTimer.current = null;
    }
    const seconds = recorderState.durationMillis / 1000;
    await recorder.stop();
    if (seconds < CAPTURE.voiceMinSeconds) {
      setStatus(`Too short. A voice afterglow is ${CAPTURE.voiceMinSeconds}–${CAPTURE.voiceMaxSeconds} seconds.`);
      return;
    }
    setBusy(true);
    await persist({ kind: 'voice', mediaUri: recorder.uri ?? undefined, placeHint: 'this place' });
  }

  async function takeStill() {
    setKind('still');
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

  const recording = recorderState.isRecording;
  const elapsed = Math.min(
    CAPTURE.voiceMaxSeconds,
    Math.floor(recorderState.durationMillis / 1000),
  );

  return (
    <Screen>
      <Text style={styles.kicker}>not a review</Text>
      <Text style={styles.title}>Leave a whisper</Text>
      <Text style={styles.body}>{status}</Text>

      {kind === null ? (
        <View style={styles.chooser}>
          <TapeButton
            label={`Record · ${CAPTURE.voiceMinSeconds}–${CAPTURE.voiceMaxSeconds}s`}
            onPress={() => void startVoice()}
            disabled={busy}
          />
          <TapeButton label="A still · no face required" kind="ghost" onPress={() => void takeStill()} disabled={busy} />
          <TapeButton label="One line" kind="ghost" onPress={() => setKind('line')} disabled={busy} />
        </View>
      ) : null}

      {kind === 'voice' ? (
        <View style={styles.panel}>
          <View style={styles.meterRow}>
            <View style={[styles.recPip, recording && styles.recPipLive]} />
            <Text style={styles.meter}>
              {recording ? `${elapsed}s` : 'ready'} / {CAPTURE.voiceMaxSeconds}s
            </Text>
          </View>
          {recording ? (
            <TapeButton
              label={PROMPT.leaveIt}
              onPress={() => void finishVoice()}
              disabled={busy || elapsed < CAPTURE.voiceMinSeconds}
            />
          ) : (
            <TapeButton label="Record" onPress={() => void startVoice()} disabled={busy} />
          )}
        </View>
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
  meterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: space.md,
  },
  recPip: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: color.tape,
    marginRight: 10,
  },
  recPipLive: {
    backgroundColor: color.amber,
    borderColor: color.amber,
  },
  meter: {
    color: color.amberSoft,
    fontFamily: font.mono,
    fontSize: 15,
    letterSpacing: 0.6,
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
    marginTop: 'auto',
    paddingTop: space.lg,
  },
});
