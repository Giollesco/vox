import { Stack } from 'expo-router';
import React from 'react';

const AudioExcerciseLayout = () => {
  return (
    <Stack screenOptions={{ animation: 'none' }}>
      <Stack.Screen
        name="[exercise]"
        options={{
          headerShown: false,
          animation: 'fade',
        }}
      />
    </Stack>
  );
};

export default AudioExcerciseLayout;
