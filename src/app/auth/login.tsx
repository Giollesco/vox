import { router, Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView } from 'react-native';

import { account } from '@/api';
import type { LoginFormProps } from '@/components/login-form';
import { LoginForm } from '@/components/login-form';
import { useAuth, useIsFirstTime } from '@/core';
import { useSoftKeyboardEffect } from '@/core/keyboard';
import { colors, FocusAwareStatusBar, ScrollView, View } from '@/ui';

export default function Login() {
  // Hooks
  const [isFirstTime, setIsFirstTime] = useIsFirstTime();
  const signIn = useAuth.use.signIn();
  useSoftKeyboardEffect();

  // Variables
  const [loading, setLoading] = useState<boolean>(false);

  // Functions
  const onSubmit: LoginFormProps['onSubmit'] = async (data) => {
    setLoading(true);
    try {
      const response = await account.createEmailPasswordSession(
        data.email,
        data.password
      );

      console.log('Login successful:', response); // Debug success

      // Use the userId to sign in
      await signIn(response.userId);
      router.replace('/(app)');
    } catch (error: any) {
      // Log the full error details
      console.error('Login failed:', error?.data);

      // If AppwriteException contains response headers, inspect them
      if (error.response) {
        console.error('Response headers:', error.response.headers);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      className="flex h-full w-full items-end justify-end"
      style={{ backgroundColor: colors.grey.main }}
    >
      <ScrollView
        keyboardDismissMode="interactive"
        contentContainerStyle={{ flex: 1, justifyContent: 'flex-end' }}
        scrollEnabled={false}
      >
        <KeyboardAvoidingView className="flex-1 gap-2 pt-[40]">
          <Stack.Screen options={{ headerShown: false }} />
          <FocusAwareStatusBar />
          <LoginForm onSubmit={onSubmit} loading={loading} />
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
}
