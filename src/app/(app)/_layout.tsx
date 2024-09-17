/* eslint-disable react/no-unstable-nested-components */
import { Redirect, SplashScreen, Stack } from 'expo-router';
import React, { useCallback, useEffect } from 'react';

import { useAuth, useIsFirstTime } from '@/core';
import { useAudioExercises } from '@/api/audio';
import { useIsMutating } from '@tanstack/react-query';
import { PageLoading } from '@/components/page-loading';

export default function TabLayout() {
  // Hooks
  const status = useAuth.use.status();
  const [isFirstTime] = useIsFirstTime();

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
  if (isFirstTime) {
    return <Redirect href="/onboarding/" />;
  }
  if (status === 'signOut') {
    return <Redirect href="/auth/login" />;
  }

  const loading = isMutatingAudioExercises > 0;

  return (
    <PageLoading loading={loading}>
      <Stack screenOptions={{ animation: 'fade' }}>
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
