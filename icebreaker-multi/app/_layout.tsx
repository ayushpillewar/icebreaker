import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ServiceProvider } from '../src/container/ServiceProvider';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    /**
     * DIP: ServiceProvider injects concrete services into the React tree via context.
     * Change `useMock={false}` on a dev build to engage real BLE hardware.
     */
    <ServiceProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="chat/[peerId]" options={{ headerShown: true }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ServiceProvider>
  );
}
