import { useAudioExercises } from '@/api/audio';
import { Progress } from '@/components/common/progress';
import { IntersetOption } from '@/components/onboarding/interests-option';
import SwipeButton from '@/components/onboarding/swipe-button';
import { isNextStepEnabled, useOnboarding } from '@/stores';
import { colors, Text, View } from '@/ui';
import { INTERESTS } from '@/utils/data';
import { MotiView, useAnimationState } from 'moti';
import React, { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { runOnJS, SharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  y: SharedValue<number>;
  index: number;
  isAnimationRunning: SharedValue<boolean>;
};

const FifthStep = ({ y, index, isAnimationRunning }: Props) => {
  // Hooks
  const { steps, setSteps, interests, updateFifthStep, getOnboarding } =
    useOnboarding();
  const { height } = useWindowDimensions();
  console.log('DEV-LOG ~ FifthStep ~ height:', height);
  const { top } = useSafeAreaInsets();
  const { data: audioExercises } = useAudioExercises();

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
        runOnJS(setSteps)(4);
      });
    });

  const nextStepGesture = Gesture.Fling()
    .enabled(
      !isAnimationRunning.value && isNextStepEnabled(steps, getOnboarding())
    )
    .direction(Directions.UP)
    .onStart((e) => {
      runOnJS(onboardingAnimationState.transitionTo)('exit');
      y.value = withTiming(y.value + height, { duration: 1000 }, () => {
        runOnJS(setSteps)(6);
      });
    });

  return (
    <View className="flex w-full h-full" style={{ height }}>
      {/* Header */}
      <View
        className="w-full items-center justify-between flex-column gap-2"
        style={{ paddingHorizontal: 20, paddingTop: top + 12 + 20 }}
      >
        <MotiView state={onboardingAnimationState} delay={0}>
          <Text className="text-md text-center opacity-50" weight="medium">
            Peti korak
          </Text>
        </MotiView>
        <MotiView state={onboardingAnimationState} delay={100}>
          <Text className="text-5xl text-center" weight="medium">
            Odaberite teme koje vas zanimaju
          </Text>
        </MotiView>
        <MotiView
          state={onboardingAnimationState}
          delay={150}
          style={{ width: '65%', marginTop: 8 }}
        >
          <Progress steps={5} currentStep={5} />
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
        {audioExercises?.map((interest, index) => (
          <MotiView
            key={index}
            state={onboardingAnimationState}
            delay={150 + index * 20}
          >
            <IntersetOption
              text={interest.title}
              selected={interests.includes(interest.title)}
              onSelect={() => updateFifthStep(interest.title)}
            />
          </MotiView>
        ))}
      </View>

      <View
        style={{
          marginBottom: 100,
          alignItems: 'center',
          display: height > 1000 ? 'flex' : 'none',
        }}
      >
        <MotiView state={onboardingAnimationState} delay={250}>
          <Text
            weight="semiBold"
            className="text-center text-primary-500"
            style={{ color: colors.primary[500] }}
          >
            Zašto nam služi ova informacija?
          </Text>
        </MotiView>
        <MotiView state={onboardingAnimationState} delay={300}>
          <Text weight="light" className="text-center">
            Teme koje odaberete nam mogu pomoći{'\n'}prilagoditi aplikaciju
            vašem ukusu
          </Text>
        </MotiView>
      </View>

      {/* Previous Step */}
      <GestureDetector gesture={previousStepGesture}>
        <View
          className="w-full h-[80] justify-center"
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
          className="w-full h-[80] justify-center"
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
            <SwipeButton />
          </MotiView>
        </View>
      </GestureDetector>
    </View>
  );
};

export default React.memo(FifthStep);

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
