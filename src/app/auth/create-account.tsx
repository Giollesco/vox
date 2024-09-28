import { zodResolver } from '@hookform/resolvers/zod';
import { ID } from 'appwrite';
import { useAssets } from 'expo-asset';
import { useRouter } from 'expo-router';
import { MotiView, useAnimationState } from 'moti';
import * as React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';
import { runOnJS, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { z } from 'zod';

import { account } from '@/api';
import { signIn, useAuth } from '@/core';
import { saveUserToDB } from '@/core/auth/utils';
import { useSoftKeyboardEffect } from '@/core/keyboard';
import { useOnboarding } from '@/stores';
import type { Account } from '@/types';
import { Button, colors, ControlledInput, Image, Text, View } from '@/ui';

type Props = {
  y: SharedValue<number>;
  index: number;
  isAnimationRunning: SharedValue<boolean>;
};

export type SignUpProps = {
  onSubmit?: SubmitHandler<SignUpForm>;
};

export type SignUpForm = {
  email: string;
  password: string;
};

const schema = z.object({
  email: z
    .string({
      required_error: 'Email adresa je obavezna',
    })
    .email('Unesite ispravnu email adresu'),
  password: z
    .string({
      required_error: 'Lozinka je obavezna',
    })
    .min(6, 'Lozinka mora imati najmanje 6 slova'),
});

export const CreateAccount = ({ y, index, isAnimationRunning }: Props) => {
  // Form
  const { handleSubmit, getValues, control } = useForm<SignUpForm>({
    resolver: zodResolver(schema),
  });

  // Hooks
  const [loading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();
  useSoftKeyboardEffect();
  const { setAccount } = useAuth();
  const { steps, setSteps, getOnboarding } = useOnboarding();
  const [assets] = useAssets([require('assets/icons/language-sign-black.png')]);
  const { width, height } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const onboardingAnimationState = useOnboardingAnimatedView();
  const onboardingImageAnimationState = useOnboardingAnimatedImage();

  // Effects
  React.useEffect(() => {
    if (steps === index) {
      if (onboardingAnimationState.current !== 'to') {
        onboardingAnimationState.transitionTo('to');
        onboardingImageAnimationState.transitionTo('to');
      }
    } else {
      if (onboardingAnimationState.current !== 'from') {
        onboardingAnimationState.transitionTo('from');
        onboardingImageAnimationState.transitionTo('from');
      }
    }
  }, [steps]);

  // Functions
  async function handleSignup() {
    setLoading(true);
    try {
      let userData = {
        ...getOnboarding(),
        ...getValues(),
        completedAudioExercises: [],
        completedLessons: [],
      };
      const newUser = await createUserAccount(userData);
      if (!newUser) {
        console.log('Sign up failed. Please try again.');
        return;
      }
      setAccount(newUser as unknown as Account);
      router.replace('/(app)');
    } catch (error) {
      console.log({ error });
      setLoading(false);
    }
    setLoading(false);
  }

  async function createUserAccount(user: Partial<Account>) {
    try {
      // Step 1: Create the Appwrite account
      const newAccount = await account.create(
        ID.unique(),
        user.email as string,
        user.password as string,
        `${user.firstName} ${user.lastName}`
      );

      // Check if account creation was successful
      if (!newAccount) {
        throw new Error('Failed to create account');
      }

      // Step 2: Create an email-password session
      const result = await account
        .createEmailPasswordSession(
          user.email as string,
          user.password as string
        )
        .then(
          (response) => {
            console.log(response); // Success
            signIn(response.userId);
          },
          (error) => {
            console.log(error); // Failure
          }
        );

      // Step 3: Save the user details in the database
      let { password, ...rest } = user;
      const newUser = saveUserToDB({
        ...rest,
        id: newAccount.$id,
      });

      // Return the saved user details from the database
      return newUser;
    } catch (error) {
      console.error('Error during user signup process:', error);
      return null; // Handle errors and return null or error as needed
    }
  }

  // Gestures
  const previousStepGesture = Gesture.Fling()
    .enabled(!isAnimationRunning.value)
    .direction(Directions.DOWN)
    .onStart((e) => {
      runOnJS(onboardingAnimationState.transitionTo)('exit');
      y.value = withTiming(y.value - height, { duration: 1000 }, () => {
        runOnJS(setSteps)(5);
      });
    });

  return (
    <View
      className="flex h-full w-full items-end justify-end"
      style={{ height }}
    >
      <ScrollView
        contentContainerStyle={{ flex: 1, justifyContent: 'flex-end' }}
        keyboardDismissMode="interactive"
        scrollEnabled={false}
      >
        {/* Previous Step */}
        <GestureDetector gesture={previousStepGesture}>
          <View
            className="h-[80] w-full justify-center"
            style={{
              height: 220,
              alignItems: 'center',
              justifyContent: 'flex-end',
              position: 'absolute',
              top: 0,
              zIndex: 10,
            }}
          />
        </GestureDetector>

        <View
          style={{
            paddingHorizontal: 10,
            marginBottom: bottom + 40,
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            width: width,
          }}
        >
          <MotiView state={onboardingAnimationState} delay={0}>
            <Text className="text-center text-5xl" weight="medium">
              Stvorite račun
            </Text>
          </MotiView>

          <View className="w-full" style={{ gap: 3 }}>
            <MotiView state={onboardingAnimationState} delay={150}>
              <ControlledInput
                testID="email-input"
                control={control}
                name="email"
                className="w-min rounded-4xl px-4 text-black"
                style={{ height: 64, backgroundColor: '#b8b8b8' }}
                placeholder="Unesite email adresu"
                placeholderTextColor={colors.neutral['500']}
                secureTextEntry={false}
                keyboardType="email-address"
              />
            </MotiView>
            <MotiView state={onboardingAnimationState} delay={200}>
              <ControlledInput
                testID="password-input"
                control={control}
                name="password"
                className="w-min rounded-4xl px-4 text-black"
                style={{ height: 64, backgroundColor: '#b8b8b8' }}
                placeholder="Unesite lozinku"
                placeholderTextColor={colors.neutral['500']}
                secureTextEntry={true}
              />
            </MotiView>
            <MotiView state={onboardingAnimationState} delay={250}>
              <Button
                testID="login-button"
                variant="secondary"
                className="w-min rounded-4xl bg-primary-500 px-4 text-white"
                style={{ height: 64, marginTop: 10 }}
                onPress={handleSignup}
                disabled={loading}
              >
                <Text className="text-2xl" weight="medium">
                  {loading ? <ActivityIndicator /> : 'Stvorite račun'}
                </Text>
              </Button>
            </MotiView>
          </View>

          <View className="flex-column w-full" style={{ gap: 3 }}>
            <MotiView state={onboardingAnimationState} delay={300}>
              <View className="w-full items-center">
                <Text
                  className="text-center opacity-50"
                  style={{ maxWidth: 240, marginTop: 10, lineHeight: 18 }}
                >
                  Prijavom u aplikaciju prihvaćate pravila o privatnosti
                </Text>
              </View>
            </MotiView>
          </View>
        </View>

        {/* Image */}
        <MotiView
          state={onboardingImageAnimationState}
          delay={250}
          className="w-full"
          style={{
            position: 'absolute',
            top: 0,
            width,
            zIndex: -1,
            opacity: 0.05,
          }}
        >
          {assets && assets.length > 0 && (
            <Image
              source={{ uri: assets[0].uri }}
              style={{ width, height: height * 0.7 }}
            />
          )}
        </MotiView>
      </ScrollView>
    </View>
  );
};

const useOnboardingAnimatedView = () => {
  return useAnimationState({
    from: {
      opacity: 0,
      translateY: 20,
    },
    to: {
      opacity: 1,
      translateY: 0,
    },
    exit: {
      opacity: 0,
      translateY: -20,
    },
  });
};

const useOnboardingAnimatedImage = () => {
  return useAnimationState({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 0.05,
    },
    exit: {
      opacity: 0,
    },
  });
};
