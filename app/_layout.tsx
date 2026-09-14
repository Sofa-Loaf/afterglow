import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { CrashScreen } from '../src/components/CrashScreen';
import { RootErrorBoundary } from '../src/components/RootErrorBoundary';
import { Wordmark } from '../src/components/Wordmark';
import { color, font } from '../src/theme';

void SplashScreen.preventAutoHideAsync().catch(() => undefined);

type RouterErrorProps = {
  error: Error;
  retry: () => void;
};

/** expo-router route errors — named export is picked up by the router. */
export function ErrorBoundary({ error, retry }: RouterErrorProps) {
  useEffect(() => {
    void SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  return <CrashScreen message={error.message || String(error)} onRetry={retry} />;
}

export default function RootLayout() {
  useEffect(() => {
    void SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  return (
    <RootErrorBoundary>
      <GestureHandlerRootView style={styles.root}>
        <StatusBar style="light" backgroundColor={color.bg} />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: color.bg },
            headerTintColor: color.amberSoft,
            headerTitleStyle: {
              fontFamily: font.serif,
              fontWeight: '400',
              color: color.ink,
            },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: color.bg },
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: 'Afterglow',
              headerTitle: () => <Wordmark size="header" />,
              headerShown: false,
            }}
          />
          <Stack.Screen name="leave" options={{ title: '' }} />
          <Stack.Screen name="capture" options={{ title: 'Leave it' }} />
          <Stack.Screen name="residue/[id]" options={{ title: 'Residue' }} />
          <Stack.Screen name="privacy" options={{ title: 'Privacy' }} />
        </Stack>
      </GestureHandlerRootView>
    </RootErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: color.bg,
  },
});
