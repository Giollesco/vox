import React from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { CreateAccount } from '../auth/create-account';
import FifthStep from './steps/fifth-step';
import FirstStep from './steps/first-step';
import FourthStep from './steps/fourth-step';
import SecondStep from './steps/second-step';
import ThirdStep from './steps/third-step';
import Welcome from './welcome';
import { colors } from '@/ui';

const OnBoarding = () => {
  // Hooks
  const { height } = useWindowDimensions();

  // Variables
  const isAnimationRunning = useSharedValue(false);
  const y = useSharedValue(0);

  // Styles
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -y.value }],
    };
  });

  return (
    <Animated.View
      style={[
        animatedStyles,
        { height: height * 7, backgroundColor: colors.grey.main },
      ]}
    >
      <Welcome y={y} index={0} isAnimationRunning={isAnimationRunning} />
      <FirstStep y={y} index={1} isAnimationRunning={isAnimationRunning} />
      <SecondStep y={y} index={2} isAnimationRunning={isAnimationRunning} />
      <ThirdStep y={y} index={3} isAnimationRunning={isAnimationRunning} />
      <FourthStep y={y} index={4} isAnimationRunning={isAnimationRunning} />
      <FifthStep y={y} index={5} isAnimationRunning={isAnimationRunning} />
      <CreateAccount y={y} index={6} isAnimationRunning={isAnimationRunning} />
    </Animated.View>
  );
};

export default OnBoarding;
