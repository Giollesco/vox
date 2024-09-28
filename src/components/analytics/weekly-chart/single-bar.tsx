import { colors } from '@/ui';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

type BarProps = {
  maxHeight: number;
  minHeight: number;
  width: number;
  progress: number;
  letter: string;
};

export const Bar: React.FC<BarProps> = ({
  maxHeight,
  minHeight,
  width,
  progress,
  letter,
}) => {
  const animatedProgress = useDerivedValue(() => {
    return withTiming(progress);
  }, [progress]);

  const rAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      animatedProgress.value,
      [0, 1],
      [minHeight, maxHeight]
    );

    const backgroundColor = interpolateColor(
      animatedProgress.value,
      [0, 1],
      [colors.grey.main, colors.black]
    );

    return {
      height: height,
      backgroundColor,
    };
  }, []);

  return (
    <View>
      <Animated.View
        style={[
          {
            width: width,
            borderRadius: 16,
            borderCurve: 'continuous',
          },
          rAnimatedStyle,
        ]}
      />
      <Text style={styles.label}>{letter}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'FiraCode-Regular',
  },
});
