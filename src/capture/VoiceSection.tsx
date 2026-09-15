import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { TapeButton } from '../components/TapeButton';
import { CAPTURE, PROMPT } from '../doctrine';
import { color, font, panel, space } from '../theme';

type Props = {
  busy: boolean;
  onStatus: (status: string) => void;
  onLeave: (mediaUri?: string) => Promise<void>;
};

/**
 * Isolated so expo-audio native code is not imported on cold start.
 * Capture loads this module only after the user taps Record.
 */
export default function VoiceSection({ busy, onStatus, onLeave }: Props) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder, 200);
  const durationMs = useRef(0);
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const started = useRef(false);
  durationMs.current = recorderState.durationMillis;

  useEffect(() => {
    if (!started.current) {
      started.current = true;
      void startRecording();
    }
    return () => {
      if (stopTimer.current) clearTimeout(stopTimer.current);
    };
    // Mount-only: start one take when the user opens Record.
  }, []);

  async function startRecording() {
    try {
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) {
        onStatus('Microphone permission is needed for a voice note.');
        return;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      onStatus(`Recording. Keep it between ${CAPTURE.voiceMinSeconds}–${CAPTURE.voiceMaxSeconds}s.`);
      stopTimer.current = setTimeout(() => {
        void finishRecording();
      }, CAPTURE.voiceMaxSeconds * 1000);
    } catch (error) {
      onStatus(error instanceof Error ? error.message : 'Could not start a voice note.');
    }
  }

  async function finishRecording() {
    if (stopTimer.current) {
      clearTimeout(stopTimer.current);
      stopTimer.current = null;
    }
    try {
      const seconds = durationMs.current / 1000;
      await recorder.stop();
      if (seconds < CAPTURE.voiceMinSeconds) {
        onStatus(
          `Too short. A voice afterglow is ${CAPTURE.voiceMinSeconds}–${CAPTURE.voiceMaxSeconds} seconds.`,
        );
        return;
      }
      await onLeave(recorder.uri ?? undefined);
    } catch (error) {
      onStatus(error instanceof Error ? error.message : 'Could not keep that voice note.');
    }
  }

  const recording = recorderState.isRecording;
  const elapsed = Math.min(
    CAPTURE.voiceMaxSeconds,
    Math.floor(recorderState.durationMillis / 1000),
  );

  return (
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
          onPress={() => void finishRecording()}
          disabled={busy || elapsed < CAPTURE.voiceMinSeconds}
        />
      ) : (
        <TapeButton label="Record" onPress={() => void startRecording()} disabled={busy} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
