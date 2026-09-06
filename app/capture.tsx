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
import { color, font } from '../src/theme';
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
        <>
          <TapeButton
            label={`Voice · ${CAPTURE.voiceMinSeconds}–${CAPTURE.voiceMaxSeconds}s`}
            onPress={() => void startVoice()}
            disabled={busy}
          />
          <TapeButton label="A still · no face required" onPress={() => void takeStill()} disabled={busy} />
          <TapeButton label="One line" onPress={() => setKind('line')} disabled={busy} />
        </>
      ) : null}

      {kind === 'voice' ? (
        <View style={styles.panel}>
          <Text style={styles.meter}>
            {recording ? `${elapsed}s` : 'ready'} / {CAPTURE.voiceMaxSeconds}s
          </Text>
          {recording ? (
            <TapeButton
              label={PROMPT.leaveIt}
              onPress={() => void finishVoice()}
              disabled={busy || elapsed < CAPTURE.voiceMinSeconds}
            />
          ) : (
            <TapeButton label="Start voice" onPress={() => void startVoice()} disabled={busy} />
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

      <TapeButton
        label={PROMPT.moveOn}
        kind="quiet"
        onPress={() => router.back()}
        disabled={busy}
      />
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
    marginBottom: 12,
  },
  body: {
    color: color.dust,
    fontFamily: font.serif,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 22,
  },
  panel: {
    borderWidth: 1,
    borderColor: color.line,
    backgroundColor: color.panel,
    padding: 16,
    marginBottom: 16,
  },
  meter: {
    color: color.amber,
    fontFamily: font.mono,
    fontSize: 16,
    marginBottom: 12,
  },
  input: {
    color: color.ink,
    fontFamily: font.serif,
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: color.tape,
    paddingVertical: 8,
    marginBottom: 8,
  },
  meta: {
    color: color.dust,
    fontFamily: font.mono,
    fontSize: 12,
    marginBottom: 12,
  },
});
