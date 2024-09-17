import type { SharedValue } from 'react-native-reanimated';
import {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  animatedValue: SharedValue<number>;
  rotation: number;
  index: number;
  prevIndex: SharedValue<number>;
  currentIndex: SharedValue<number>;
  maxVisibleItems: number;
};

export const useExerciseCardAnimatedStyles = ({
  animatedValue,
  rotation,
  index,
  prevIndex,
  currentIndex,
  maxVisibleItems,
}: Props) => {
  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      animatedValue.value,
      [index - 1, index, index + 1],
      [-80, 1, 30]
    );
    const translateY2 = interpolate(
      animatedValue.value,
      [index - 1, index, index + 1],
      [-400, 1, 200]
    );
    const scale = interpolate(
      animatedValue.value,
      [index - 1, index, index + 1],
      [0.85, 1, 1.2]
    );
    const rotate = interpolate(
      animatedValue.value,
      [index - 1, index, index + 1],
      [rotation, 0, -rotation]
    );
    const opacity = interpolate(
      animatedValue.value,
      [index - 1, index, index + 1],
      [1, 1, 0]
    );

    const backgroundColor = interpolateColor(
      animatedValue.value,
      [index - 2, index - 1, index],
      ['#cccccc', '#e1e1e1', '#ffffff']
    );

    return {
      transform: [
        {
          translateY: index === prevIndex.value ? translateY2 : translateY,
        },
        { scale },
        { rotate: `${rotate}deg` },
      ],
      backgroundColor,
      opacity:
        index < currentIndex.value + maxVisibleItems - 1 // 2
          ? opacity
          : index === currentIndex.value + maxVisibleItems - 1
          ? withTiming(1)
          : withTiming(0),
    };
  });

  const animatedWrapperStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        animatedValue.value,
        [index - 2, index - 1, index],
        [0.2, 0.4, 1]
      ),
    };
  });
  return {
    animatedStyle,
    animatedWrapperStyle,
  };
};
