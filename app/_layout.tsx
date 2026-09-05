import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { color } from '../src/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: color.bg },
          headerTintColor: color.amber,
          headerTitleStyle: { fontWeight: '400' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: color.bg },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Afterglow' }} />
        <Stack.Screen name="leave" options={{ title: '' }} />
        <Stack.Screen name="capture" options={{ title: 'Leave it' }} />
        <Stack.Screen name="residue/[id]" options={{ title: 'Residue' }} />
        <Stack.Screen name="privacy" options={{ title: 'Privacy' }} />
      </Stack>
    </>
  );
}
