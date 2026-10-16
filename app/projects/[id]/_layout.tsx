import { Stack } from 'expo-router';

export default function ProjectDetailLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F8F6F5' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="apply" />
      <Stack.Screen name="manage-team" />
      <Stack.Screen name="request-completion" />
    </Stack>
  );
}