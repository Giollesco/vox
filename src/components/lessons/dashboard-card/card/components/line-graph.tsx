import * as React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { colors, View } from '@/ui';

type Props = {
  progress: number;
};
export const LineGraph = ({ progress }: Props) => {
  // Constants
  const duration = 1000;

  // Hooks
  const { width } = useWindowDimensions();
  const completedProgress = useSharedValue<number>(0);
  const baseProgress = useSharedValue<number>(0);

  // Effects
  React.useEffect(() => {
    baseProgress.value = withDelay(
      250,
      withTiming(1, {
        duration,
      })
    );
    completedProgress.value = withDelay(
      duration,
      withTiming(progress, { duration })
    );
  }, []);

  // Styles
  const completedAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${completedProgress.value * 100}%`,
    };
  });

  const baseBarAnimatedStyles = useAnimatedStyle(() => {
    return {
      width: `${baseProgress.value * 100}%`,
    };
  });

  return (
    <View style={[styles.container]}>
      <Animated.View style={[styles.completedBar, completedAnimatedStyle]} />
      <Animated.View style={[styles.baseBar, baseBarAnimatedStyles]}>
        <View style={[styles.stripContainer, { width }]}>
          {Array.from({ length: 28 }).map((_, index) => (
            <View style={styles.stripLine} key={index} />
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    maxHeight: 60,
  },
  completedBar: {
    backgroundColor: colors.black,
    height: '100%',
    width: '60%',
    borderRadius: 14,
    position: 'absolute',
    zIndex: 2,
  },
  baseBar: {
    backgroundColor: colors.primary[500],
    height: '100%',
    width: '100%',
    borderRadius: 14,
    zIndex: 1,
    overflow: 'hidden',
  },
  stripLine: {
    width: 6,
    height: '140%',
    backgroundColor: colors.grey.main,
    opacity: 0.5,
    transform: [{ rotateZ: '20deg' }],
  },
  stripContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
