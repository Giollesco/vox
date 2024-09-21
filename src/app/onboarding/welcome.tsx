import { useAssets } from 'expo-asset';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { MotiView, useAnimationState } from 'moti';
import * as React from 'react';
import { useWindowDimensions } from 'react-native';
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';
import { runOnJS, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SwipeButton from '@/components/onboarding/swipe-button';
import { useOnboarding } from '@/stores';
import { Text, View } from '@/ui';

type Props = {
  y: SharedValue<number>;
  index: number;
  isAnimationRunning: SharedValue<boolean>;
};

const Welcome = ({ y, index, isAnimationRunning }: Props) => {
  // Hooks
  const { steps, setSteps } = useOnboarding();
  const [assets] = useAssets([require('assets/icons/language-sign-black.png')]);
  const { width, height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const onboardingAnimationState = useOnboardingAnimatedView();
  const onboardingImageAnimationState = useOnboardingAnimatedImage();

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

  // Gestures
  const nextStepGesture = Gesture.Fling()
    .enabled(!isAnimationRunning.value)
    .direction(Directions.UP)
    .onStart((e) => {
      runOnJS(onboardingAnimationState.transitionTo)('exit');
      runOnJS(onboardingImageAnimationState.transitionTo)('exit');
      y.value = withTiming(y.value + height, { duration: 1000 }, () => {
        runOnJS(setSteps)(1);
      });
    });

  return (
    <View className="flex h-full w-full" style={{ height }}>
      {/* Header */}
      <View
        className="w-full flex-row justify-between align-middle"
        style={{
          paddingHorizontal: 20,
          paddingTop: top + 12,
          zIndex: 100,
        }}
      >
        <MotiView delay={100} state={onboardingAnimationState}>
          <Text className="text-sm" weight="bold">
            VOX
          </Text>
        </MotiView>
        <MotiView delay={100} state={onboardingAnimationState}>
          <Link href="/auth/login" asChild>
            <Text className="text-sm" weight="regular">
              Prijava
            </Text>
          </Link>
        </MotiView>
      </View>
      <View className="flex-1 pt-[40]" />
      <View
        className="gap-2"
        style={{ paddingBottom: 100, paddingHorizontal: 20 }}
      >
        <MotiView delay={0} state={onboardingAnimationState}>
          <Text className="text-xl opacity-50" weight="extraLight">
            Korak po korak
          </Text>
        </MotiView>
        <MotiView delay={50} state={onboardingAnimationState}>
          <Text className="text-5xl" weight="medium" style={{ lineHeight: 40 }}>
            Učimo jezik na jednostavan način!
          </Text>
        </MotiView>
      </View>

      {/* Next Step */}
      <GestureDetector gesture={nextStepGesture}>
        <View
          className="h-[80] w-full justify-center"
          style={{
            height: 240,
            alignItems: 'center',
            justifyContent: 'flex-end',
            position: 'absolute',
            bottom: 0,
            zIndex: 10,
          }}
        >
          <MotiView delay={100} state={onboardingAnimationState}>
            <SwipeButton />
          </MotiView>
        </View>
      </GestureDetector>

      <MotiView
        state={onboardingImageAnimationState}
        delay={100}
        className="w-full"
        style={{
          position: 'absolute',
          top: 0,
          width,
          zIndex: 0,
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
    </View>
  );
};

export default React.memo(Welcome);

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
