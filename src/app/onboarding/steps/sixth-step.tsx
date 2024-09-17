import { useAssets } from 'expo-asset';
import { MotiView, useAnimationState } from 'moti';
import React, { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';
import { runOnJS, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Progress } from '@/components/common/progress';
import { ReminderPicker } from '@/components/common/reminder-picker';
import SwipeButton from '@/components/onboarding/swipe-button';
import { useOnboarding } from '@/stores';
import { colors, Image, Text, View } from '@/ui';

type Props = {
  y: SharedValue<number>;
  index: number;
  isAnimationRunning: SharedValue<boolean>;
};

const SixthStep = ({ y, index, isAnimationRunning }: Props) => {
  // Hooks
  const [assets] = useAssets([require('assets/icon.png')]);
  const { steps, setSteps, reminder, updateSixthStep, getOnboarding } =
    useOnboarding();
  const { height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();

  // Variables
  // Styles
  const onboardingAnimationState = useOnboardingAnimatedView();
  useEffect(() => {
    if (steps === index) {
      if (onboardingAnimationState.current !== 'to') {
        onboardingAnimationState.transitionTo('to');
      }
    } else {
      if (onboardingAnimationState.current !== 'from') {
        onboardingAnimationState.transitionTo('from');
      }
    }
  }, [steps]);

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

  const nextStepGesture = Gesture.Fling()
    // .enabled(
    //   !isAnimationRunning.value && isNextStepEnabled(steps, getOnboarding())
    // )
    .enabled(false)
    .direction(Directions.UP)
    .onStart((e) => {
      runOnJS(onboardingAnimationState.transitionTo)('exit');
      y.value = withTiming(y.value + height, { duration: 1000 }, () => {
        runOnJS(setSteps)(7);
      });
    });

  return (
    <View className="flex h-full w-full" style={{ height }}>
      {/* Header */}
      <View
        className="flex-column w-full items-center justify-between gap-2"
        style={{ paddingHorizontal: 20, paddingTop: top + 12 + 20 }}
      >
        <MotiView state={onboardingAnimationState} delay={0}>
          <Text
            className="text-md text-center text-white opacity-50"
            weight="medium"
          >
            Šesti korak
          </Text>
        </MotiView>
        <MotiView state={onboardingAnimationState} delay={100}>
          <Text className="text-center text-5xl text-white" weight="medium">
            Postavite alarm i dopuštenja
          </Text>
        </MotiView>
        <MotiView
          state={onboardingAnimationState}
          delay={150}
          style={{ width: '65%', marginTop: 8 }}
        >
          <Progress steps={5} currentStep={6} />
        </MotiView>
      </View>
      <View
        className="flex-1"
        style={{
          marginTop: 40,
          paddingHorizontal: 10,
          gap: 3,
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {/* Notification  */}
        <View
          className="w-full items-center justify-end"
          style={{ height: 100, overflow: 'hidden' }}
        >
          <MotiView state={onboardingAnimationState} delay={250}>
            <View
              className="flex-row items-center justify-start gap-4"
              style={{
                width: '100%',
                padding: 10,
                borderRadius: 20,
                backgroundColor: '#3f3f3f',
                transform: [{ scale: 0.9 }],
              }}
            >
              {assets && assets.length > 0 && (
                <Image
                  source={{ uri: assets[0].uri }}
                  style={{ width: 48, height: 48, borderRadius: 10 }}
                />
              )}
              <View className="flex-1 items-start justify-center">
                <Text
                  className="text-2xl"
                  weight="medium"
                  style={{ marginBottom: -4 }}
                >
                  Vox
                </Text>
                <Text className="text-sm opacity-50">
                  Ne zaboravite na vašu dnevnu dozu učenja
                </Text>
              </View>
            </View>
          </MotiView>
          <MotiView state={onboardingAnimationState} delay={200}>
            <View
              className="flex-row items-center justify-start gap-4"
              style={{
                width: '100%',
                padding: 10,
                borderRadius: 20,
                backgroundColor: '#444',
                transform: [{ translateY: -54 }, { scale: 0.95 }],
              }}
            >
              {assets && assets.length > 0 && (
                <Image
                  source={{ uri: assets[0].uri }}
                  style={{ width: 48, height: 48, borderRadius: 10 }}
                />
              )}
              <View className="flex-1 items-start justify-center">
                <Text
                  className="text-2xl"
                  weight="medium"
                  style={{ marginBottom: -4 }}
                >
                  Vox
                </Text>
                <Text className="text-sm opacity-50">
                  Ne zaboravite na vašu dnevnu dozu učenja
                </Text>
              </View>
            </View>
          </MotiView>
          <MotiView state={onboardingAnimationState} delay={150}>
            <View
              className="flex-row items-center justify-start gap-4"
              style={{
                width: '100%',
                padding: 10,
                borderRadius: 20,
                backgroundColor: '#555',
                transform: [{ translateY: -108 }],
              }}
            >
              {assets && assets.length > 0 && (
                <Image
                  source={{ uri: assets[0].uri }}
                  style={{ width: 48, height: 48, borderRadius: 10 }}
                />
              )}
              <View className="flex-1 items-start justify-center">
                <Text
                  className="text-2xl"
                  weight="medium"
                  style={{ marginBottom: -4 }}
                >
                  Vox
                </Text>
                <Text className="text-sm opacity-50">
                  Ne zaboravite na vašu dnevnu dozu učenja
                </Text>
              </View>
            </View>
          </MotiView>
        </View>

        {/* Reminder */}
        <View
          className="flex-1"
          style={{
            width: '100%',
            height: '100%',
            paddingTop: 100,
            marginTop: -100,
          }}
        >
          <ReminderPicker
            value={reminder}
            onSelect={updateSixthStep}
            size="small"
          />
        </View>
      </View>

      <View style={{ marginBottom: 100, alignItems: 'center' }}>
        <MotiView state={onboardingAnimationState} delay={250}>
          <Text
            weight="semiBold"
            className="text-center text-primary-500"
            style={{ color: colors.primary[500] }}
          >
            Napomena!
          </Text>
        </MotiView>
        <MotiView state={onboardingAnimationState} delay={300}>
          <Text weight="light" className="text-center text-white">
            Ove postavke možete naknadno promijeniti u{'\n'}postavkama unutar
            aplikacije
          </Text>
        </MotiView>
      </View>

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
          <MotiView delay={300} state={onboardingAnimationState}>
            <SwipeButton color={colors.primary['500']} />
          </MotiView>
        </View>
      </GestureDetector>
    </View>
  );
};

export default React.memo(SixthStep);

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
