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
import { OnboardingCard } from '@/components/onboarding/card';
import { SelectOption } from '@/components/onboarding/select-option';
import SwipeButton from '@/components/onboarding/swipe-button';
import { isNextStepEnabled, useOnboarding } from '@/stores';
import { colors, Text, View } from '@/ui';
import { STARTING_POINTS } from '@/utils/data';

type Props = {
  y: SharedValue<number>;
  index: number;
  isAnimationRunning: SharedValue<boolean>;
};

const ThirdStep = ({ y, index, isAnimationRunning }: Props) => {
  // Hooks
  const { startingPoint, steps, setSteps, updateThirdStep, getOnboarding } =
    useOnboarding();
  const { width, height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();

  // Variables
  // Styles
  const onboardingAnimationState = useOnboardingAnimatedView();
  const enBoxAnimationState = useEnBoxAnimatedView();
  const frBoxAnimationState = useFrBoxAnimatedView();
  const hrBoxAnimationState = useHrBoxAnimatedView();
  useEffect(() => {
    if (steps === index) {
      if (onboardingAnimationState.current !== 'to') {
        onboardingAnimationState.transitionTo('to');
        enBoxAnimationState.transitionTo('to');
        frBoxAnimationState.transitionTo('to');
        hrBoxAnimationState.transitionTo('to');
      }
    } else {
      if (onboardingAnimationState.current !== 'from') {
        onboardingAnimationState.transitionTo('from');
        enBoxAnimationState.transitionTo('from');
        frBoxAnimationState.transitionTo('from');
        hrBoxAnimationState.transitionTo('from');
      }
    }
  }, [steps]);

  // Gestures
  const previousStepGesture = Gesture.Fling()
    .enabled(!isAnimationRunning.value)
    .direction(Directions.DOWN)
    .onStart((e) => {
      runOnJS(onboardingAnimationState.transitionTo)('exit');
      runOnJS(enBoxAnimationState.transitionTo)('exit');
      runOnJS(frBoxAnimationState.transitionTo)('exit');
      runOnJS(hrBoxAnimationState.transitionTo)('exit');
      y.value = withTiming(y.value - height, { duration: 1000 }, () => {
        runOnJS(setSteps)(2);
      });
    });

  const nextStepGesture = Gesture.Fling()
    .enabled(
      !isAnimationRunning.value && isNextStepEnabled(steps, getOnboarding())
    )
    .direction(Directions.UP)
    .onStart((e) => {
      runOnJS(onboardingAnimationState.transitionTo)('exit');
      runOnJS(enBoxAnimationState.transitionTo)('exit');
      runOnJS(frBoxAnimationState.transitionTo)('exit');
      runOnJS(hrBoxAnimationState.transitionTo)('exit');
      y.value = withTiming(y.value + height, { duration: 1000 }, () => {
        runOnJS(setSteps)(4);
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
          <Text className="text-md text-center opacity-50" weight="medium">
            Treći korak
          </Text>
        </MotiView>
        <MotiView state={onboardingAnimationState} delay={100}>
          <Text className="text-center text-5xl" weight="medium">
            Odaberite vašu trenutnu razinu
          </Text>
        </MotiView>
        <MotiView
          state={onboardingAnimationState}
          delay={150}
          style={{ width: '65%', marginTop: 8 }}
        >
          <Progress steps={5} currentStep={3} />
        </MotiView>
      </View>
      <View
        className="flex-1"
        style={{ marginTop: 40, paddingHorizontal: 10, gap: 3 }}
      >
        {STARTING_POINTS.map((point, index) => {
          return (
            <MotiView
              state={onboardingAnimationState}
              delay={150 + index * 50}
              key={index}
            >
              <SelectOption
                text={point.text}
                selected={startingPoint === point.level}
                onSelect={() => {
                  updateThirdStep(
                    startingPoint === point.level ? null : point.level
                  );
                }}
              />
            </MotiView>
          );
        })}
      </View>

      <MotiView
        state={enBoxAnimationState}
        delay={250}
        style={[
          { position: 'absolute', bottom: 220, right: width / 2 - 40 + 20 },
        ]}
      >
        <OnboardingCard
          language="HR"
          word="Razina"
          backgroundColor="black"
          color="white"
          scale={0.85}
        />
      </MotiView>

      <MotiView
        state={frBoxAnimationState}
        delay={300}
        style={[
          { position: 'absolute', bottom: 180, left: width / 2 - 40 + 60 },
        ]}
      >
        <OnboardingCard
          language="FR"
          word="Niveau"
          backgroundColor="#ffffff60"
          color="black"
          scale={1}
        />
      </MotiView>

      <MotiView
        state={hrBoxAnimationState}
        delay={400}
        style={[
          { position: 'absolute', bottom: 112, left: width / 2 - 40 - 32 },
        ]}
      >
        <OnboardingCard
          language="EN"
          word="Level"
          backgroundColor={colors.primary[500]}
          color="black"
          scale={1.25}
          showStroke
        />
      </MotiView>

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
            <SwipeButton />
          </MotiView>
        </View>
      </GestureDetector>
    </View>
  );
};

export default React.memo(ThirdStep);

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

const useEnBoxAnimatedView = () => {
  return useAnimationState({
    from: {
      opacity: 0,
      scale: 0.8,
      rotateZ: '0deg',
    },
    to: {
      opacity: 1,
      scale: 1,
      rotateZ: '-20deg',
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      rotateZ: '20deg',
    },
  });
};

const useFrBoxAnimatedView = () => {
  return useAnimationState({
    from: {
      opacity: 0,
      scale: 0.8,
      rotateZ: '30deg',
    },
    to: {
      opacity: 1,
      scale: 1,
      rotateZ: '20deg',
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      rotateZ: '0deg',
    },
  });
};

const useHrBoxAnimatedView = () => {
  return useAnimationState({
    from: {
      opacity: 0,
      scale: 0.8,
      rotateZ: '10deg',
    },
    to: {
      opacity: 1,
      scale: 1,
      rotateZ: '-20deg',
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      rotateZ: '-20deg',
    },
  });
};
