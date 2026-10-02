import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import '../global.css';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const { isAuthenticated, isLoading, checkAuthStatus } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';

    if (!isAuthenticated && !inAuthGroup && !inOnboardingGroup) {
      router.replace('/(auth)/sign-in');
    } else if (isAuthenticated && (inAuthGroup || inOnboardingGroup)) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF8C69" />
      </View>
    );
  }

  return (
    <>

      <StatusBar style="dark" backgroundColor="#F8F6F5" />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F8F6F5' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(menu)" />
        <Stack.Screen
          name="create"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="profile" />
        <Stack.Screen name="projects/[id]" />
      </Stack>

    </>
  );
}