import { Progress } from '@/components/common/progress';
import { SelectOption } from '@/components/onboarding/select-option';
import SwipeButton from '@/components/onboarding/swipe-button';
import { isNextStepEnabled, useOnboarding } from '@/stores';
import { Language } from '@/types';
import { colors, Text, View } from '@/ui';
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

const SecondStep = ({ y, index, isAnimationRunning }: Props) => {
  // Hooks
  const { language, steps, setSteps, updateSecondStep, getOnboarding } =
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
        runOnJS(setSteps)(1);
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
        runOnJS(setSteps)(3);
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
            Drugi korak
          </Text>
        </MotiView>
        <MotiView state={onboardingAnimationState} delay={100}>
          <Text className="text-5xl text-center" weight="medium">
            Odaberite koji jezik želite učiti
          </Text>
        </MotiView>
        <MotiView
          state={onboardingAnimationState}
          delay={150}
          style={{ width: '65%', marginTop: 8 }}
        >
          <Progress steps={5} currentStep={2} />
        </MotiView>
      </View>
      <View
        className="flex-1 gap-2"
        style={{ marginTop: 40, paddingHorizontal: 10 }}
      >
        {/* Languages here */}
        <MotiView state={onboardingAnimationState} delay={150}>
          <SelectOption
            text="Engleski"
            selected={language === Language.EN}
            onSelect={() => {
              updateSecondStep(language === Language.EN ? null : Language.EN);
            }}
          />
        </MotiView>

        <MotiView state={onboardingAnimationState} delay={200}>
          <Text weight="light" className="text-center">
            {`- Više jezika uskoro -`}
          </Text>
        </MotiView>
      </View>

      <View style={{ marginBottom: 100, alignItems: 'center' }}>
        <MotiView state={onboardingAnimationState} delay={250}>
          <Text
            weight="semiBold"
            className="text-center text-primary-500"
            style={{ color: colors.primary[500] }}
          >
            Zanimljiva činjenica!
          </Text>
        </MotiView>
        <MotiView state={onboardingAnimationState} delay={300}>
          <Text weight="light" className="text-center">
            Jeste li znali da na svijetu ima oko
            <Text weight="semiBold" className="text-center">
              {` 6800`}
            </Text>
            {'\n'} raznih jezika
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

export default React.memo(SecondStep);

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
