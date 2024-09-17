import { Progress } from '@/components/common/progress';
import { OnboardingCard } from '@/components/onboarding/card';
import SwipeButton from '@/components/onboarding/swipe-button';
import { useOnboarding } from '@/stores';
import { colors, Input, Text, View } from '@/ui';
import { MotiView, useAnimationState } from 'moti';
import React, { useEffect, useState } from 'react';
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

const FirstStep = ({ y, index, isAnimationRunning }: Props) => {
  // Hooks
  const { steps, setSteps, updateFirstStep } = useOnboarding();
  const { width, height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();

  // Variables
  const [userInformations, setUserInformations] = useState<{
    firstName: string;
    lastName: string;
  }>({
    firstName: '',
    lastName: '',
  });

  // Methods
  function fieldsValidated(): boolean {
    return (
      userInformations.firstName.length > 0 &&
      userInformations.lastName.length > 0
    );
  }

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
        runOnJS(setSteps)(0);
      });
    });

  const nextStepGesture = Gesture.Fling()
    .enabled(!isAnimationRunning.value && fieldsValidated())
    .direction(Directions.UP)
    .onStart((e) => {
      runOnJS(onboardingAnimationState.transitionTo)('exit');
      runOnJS(enBoxAnimationState.transitionTo)('exit');
      runOnJS(frBoxAnimationState.transitionTo)('exit');
      runOnJS(hrBoxAnimationState.transitionTo)('exit');
      y.value = withTiming(y.value + height, { duration: 1000 }, () => {
        runOnJS(setSteps)(2);
        runOnJS(updateFirstStep)({
          firstName: userInformations.firstName,
          lastName: userInformations.lastName,
        });
      });
    });

  return (
    <View className="flex w-full h-full" style={{ height }}>
      {/* Header */}
      <View
        className="w-full items-center justify-between flex-column gap-2"
        style={{
          paddingHorizontal: 20,
          paddingTop: top + 12 + 20,
        }}
      >
        <MotiView state={onboardingAnimationState} delay={0}>
          <Text className="text-md text-center opacity-50" weight="medium">
            Prvi korak
          </Text>
        </MotiView>
        <MotiView state={onboardingAnimationState} delay={100}>
          <Text className="text-5xl text-center" weight="medium">
            Za početak, unesite svoje ime
          </Text>
        </MotiView>
        <MotiView
          state={onboardingAnimationState}
          delay={150}
          style={{ width: '65%', marginTop: 8 }}
        >
          <Progress steps={5} currentStep={1} />
        </MotiView>
      </View>
      <View style={{ marginTop: 40, paddingHorizontal: 10, gap: 3 }}>
        <MotiView state={onboardingAnimationState} delay={150}>
          <Input
            testID="firstname-input"
            onChangeText={(text) =>
              setUserInformations({ ...userInformations, firstName: text })
            }
            className="rounded-4xl px-4 w-min text-black"
            style={{ height: 64, backgroundColor: '#ffffff30' }}
            placeholder="Unesite svoje ime"
            placeholderTextColor={colors.neutral['500']}
            secureTextEntry={false}
            weight="medium"
          />
        </MotiView>
        <MotiView state={onboardingAnimationState} delay={200}>
          <Input
            testID="lastname-input"
            onChangeText={(text) =>
              setUserInformations({ ...userInformations, lastName: text })
            }
            className="rounded-4xl px-4 w-min text-black mb-4"
            style={{ height: 64, backgroundColor: '#ffffff30' }}
            placeholder="Unesite svoje prezime"
            placeholderTextColor={colors.neutral['500']}
            secureTextEntry={false}
            weight="medium"
          />
        </MotiView>
      </View>
      <MotiView
        state={enBoxAnimationState}
        delay={250}
        style={[
          { position: 'absolute', bottom: 240, right: width / 2 - 40 + 60 },
        ]}
      >
        <OnboardingCard
          language="EN"
          word="Name"
          backgroundColor="black"
          color="white"
          scale={0.85}
        />
      </MotiView>

      <MotiView
        state={frBoxAnimationState}
        delay={300}
        style={[
          { position: 'absolute', bottom: 160, left: width / 2 - 40 - 120 },
        ]}
      >
        <OnboardingCard
          language="FR"
          word="Nom"
          backgroundColor="#ffffff60"
          color="black"
          scale={1.2}
          showStroke
        />
      </MotiView>

      <MotiView
        state={hrBoxAnimationState}
        delay={400}
        style={[{ position: 'absolute', bottom: 120, right: 20 }]}
      >
        <OnboardingCard
          language="HR"
          word="Ime"
          backgroundColor={colors.primary[500]}
          color="black"
          scale={1.75}
        />
      </MotiView>

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

export default React.memo(FirstStep);

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
