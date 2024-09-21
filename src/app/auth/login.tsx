import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView } from 'react-native';

import { account } from '@/api';
import type { LoginFormProps } from '@/components/login-form';
import { LoginForm } from '@/components/login-form';
import { useAuth, useIsFirstTime } from '@/core';
import { useSoftKeyboardEffect } from '@/core/keyboard';
import { FocusAwareStatusBar, ScrollView, View } from '@/ui';

export default function Login() {
  // Hooks
  const [isFirstTime, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();
  const signIn = useAuth.use.signIn();
  // useSoftKeyboardEffect();

  // Effects
  React.useEffect(() => {
    // If it's the first time user should be redirected to the onboarding.
    // If user came to login screen from onboarding, we should set isFirstTime to false.
    // because we don't want to redirect user to onboarding again.
    if (isFirstTime) {
      setIsFirstTime(false);
    }
  }, [isFirstTime, setIsFirstTime]);

  // Variables
  const [loading, setLoading] = useState<boolean>(false);

  // Functions
  const onSubmit: LoginFormProps['onSubmit'] = (data) => {
    setLoading(true);
    const promise = account
      .createEmailPasswordSession(data.email, data.password)
      .then(
        function (response) {
          console.log(response); // Success
          signIn(response.userId);
          // Redirect to the app
          router.replace('/(app)');
        },
        function (error) {
          console.log(error); // Failure
        }
      )
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <View
      className="flex h-full w-full items-end justify-end"
      style={{ backgroundColor: '#A8A6AA' }}
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
