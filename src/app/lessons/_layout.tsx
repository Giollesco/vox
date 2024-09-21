import { Stack } from 'expo-router';
import React from 'react';

const LessonLayout = () => {
  return (
    <Stack
      screenOptions={{
        animation: 'none',
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="[lesson]"
        options={{
          headerShown: false,
          animation: 'fade',
        }}
      />
    </Stack>
  );
};

export default LessonLayout;
