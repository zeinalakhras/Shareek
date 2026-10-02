import { Stack } from 'expo-router';

export default function MenuLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F8F6F5' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="saved" />
      <Stack.Screen name="my-projects" />
      <Stack.Screen name="my-requests" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="settings" />
      <Stack.Screen name='drafts' />
    </Stack>
  );
}