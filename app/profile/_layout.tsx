import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F8F6F5' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="additional-info" />
    </Stack>
  );
}