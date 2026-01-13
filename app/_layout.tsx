import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../src/theme/colors';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.cream },
          headerShadowVisible: false,
          headerTitleStyle: { color: Colors.chocolate, fontWeight: '800' },
          contentStyle: { backgroundColor: Colors.cream },
        }}
      />
    </>
  );
}

