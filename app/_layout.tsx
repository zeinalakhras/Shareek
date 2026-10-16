import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import '../global.css';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { hydrateSavedProjects } from '@/utils/savedProjects';

SplashScreen.preventAutoHideAsync();
hydrateSavedProjects();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const { isAuthenticated, isCompletingSetup, isLoading, bootstrap } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';

    if (!isAuthenticated && !inAuthGroup && !inOnboardingGroup) {
      router.replace('/(auth)/sign-in');
    } else if (
      isAuthenticated &&
      !isCompletingSetup &&
      (inAuthGroup || inOnboardingGroup)
    ) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, isCompletingSetup, isLoading, segments]);

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
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(setup)" />
        <Stack.Screen name="(tabs)" />
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