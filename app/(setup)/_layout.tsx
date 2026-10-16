import { Stack } from 'expo-router'

const SetupLayout = () => {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: '#F8F6F5' },
        headerShown: false,
      }}
    >
      <Stack.Screen name="success" options={{ animation: 'fade' }} />
      <Stack.Screen name="step2" />
      <Stack.Screen name="step3" />
      <Stack.Screen name="step4" />
      <Stack.Screen name="step5" />
    </Stack>
  )
}

export default SetupLayout
