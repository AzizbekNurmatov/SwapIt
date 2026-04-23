import { Stack } from 'expo-router';

// Guest stack: login lives here before the user reaches the main tabs.
export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}