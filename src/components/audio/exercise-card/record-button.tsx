import * as React from 'react';

import { colors } from '@/ui';
import { SPRING_CONFIG } from '@/utils/config';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Haptics from 'expo-haptics';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolateColor,
  runOnJS,
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  isWordCorrect: boolean;
  progress: SharedValue<number>;
  isRecording: boolean;
  onPress: () => void;
};

const AnimatedIcon = Animated.createAnimatedComponent(FontAwesome);

export const RecordButton = ({
  isWordCorrect,
  isRecording,
  progress,
  onPress,
}: Props) => {
  // Hooks
  const isActive = useSharedValue<number>(0);

  // Gesture
  const gesture = Gesture.Tap()
    .maxDuration(10000)
    .onTouchesDown(() => {
      isActive.value = 1;
    })
    .onTouchesUp(() => {
      if (onPress) {
        runOnJS(onPress)();
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
      }
    })
    .onFinalize(() => {
      isActive.value = 0;
    });

  // Style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(isActive.value === 1 ? 0.9 : 1, SPRING_CONFIG),
        },
      ],
    };
  });

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: '#000000',
      // backgroundColor: interpolateColor(
      //   progress.value,
      //   [0, 1],
      //   ['#000000', colors.primary['500']]
      // ),
    };
  });

  const animatedBlurProps = useAnimatedProps(() => {
    return {
      // color: interpolateColor(progress.value, [0, 1], ['#ffffff', '#000000']),
      color: '#ffffff',
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={animatedStyle}>
        <Animated.View style={[styles.button, animatedButtonStyle]}>
          <AnimatedIcon
            animatedProps={animatedBlurProps}
            name="microphone"
            size={20}
          />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#333',
    borderRadius: 24,
    height: 80,
    width: 80,
    transform: [{ translateY: -40 }],
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
});
