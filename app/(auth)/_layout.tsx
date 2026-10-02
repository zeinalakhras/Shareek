import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: '#F8F6F5' },
        headerShown: false,
      }}
    >
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="sign-up-step2" />
      <Stack.Screen name="sign-up-step3" />
      <Stack.Screen name="sign-up-step4" />
      <Stack.Screen name="sign-up-step5" />
      <Stack.Screen name="sign-up-success" options={{ animation: 'fade' }} />
      <Stack.Screen name="forget-password" />
      <Stack.Screen name="reset-password" />
      <Stack.Screen name="email-verification" />
    </Stack>
  )
}

export default AuthLayout