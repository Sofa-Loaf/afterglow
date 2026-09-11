import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { Wordmark } from '../src/components/Wordmark';
import { color, font } from '../src/theme';

void SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  useEffect(() => {
    void SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  return (
    <>
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
    </>
  );
}
