import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: '#F8F6F5' },
      animation: 'slide_from_right',
    }}>
      <Stack.Screen name="first" />
      <Stack.Screen name="second" />
      <Stack.Screen name="third" />
    </Stack>
  );
}