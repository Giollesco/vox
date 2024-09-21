import { useIsMutating } from '@tanstack/react-query';
import { Redirect, SplashScreen, Stack } from 'expo-router';
import React, { useCallback, useEffect } from 'react';

import { PageLoading } from '@/components/page-loading';
import { useAuth } from '@/core';

export default function TabLayout() {
  // Hooks
  const status = useAuth.use.status();

  // Fetching data
  const isMutatingAudioExercises = useIsMutating({
    mutationKey: ['audio-exercises'],
  });

  // Methods
  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  // Effects
  useEffect(() => {
    if (status !== 'idle') {
      setTimeout(() => {
        hideSplash();
      }, 1000);
    }
  }, [hideSplash, status]);

  // Redirects
  if (status === 'signOut') {
    return <Redirect href="/auth/login" />;
  }

  const loading = isMutatingAudioExercises > 0;

  return (
    <PageLoading loading={loading}>
      <Stack screenOptions={{ animation: 'fade', headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{ headerShown: false, animation: 'fade' }}
        />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="style" options={{ headerShown: false }} />
      </Stack>
    </PageLoading>
  );
}
