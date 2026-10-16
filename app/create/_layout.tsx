import { Stack } from 'expo-router';

export default function CreateLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F8F6F5' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="create-step1" />
      <Stack.Screen name="create-step2" />
      <Stack.Screen name="create-step3" />
      <Stack.Screen name="success" options={{ animation: 'fade' }} />
    </Stack>
  );
}