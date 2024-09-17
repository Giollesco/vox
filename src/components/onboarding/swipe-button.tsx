import { Entypo } from '@expo/vector-icons';
import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/ui';

type Props = {
  color?: string;
};

const SwipeButton = ({ color = colors.primary['500'] }: Props) => {
  // Variables
  const progress = useSharedValue<number>(0);

  // Effects
  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1500 }), -1, true);
  }, []);

  // Styles
  const bottomArrowStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: progress.value * 14,
        },
      ],
    };
  });

  const topArrowStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: progress.value * 10,
        },
      ],
    };
  });

  return (
    <Animated.View style={{ marginBottom: 40 }}>
      <Animated.View style={topArrowStyle}>
        <Entypo
          name="chevron-small-down"
          size={44}
          color={color}
          style={{ marginBottom: -36, opacity: 0.35 }}
        />
      </Animated.View>
      <Animated.View style={bottomArrowStyle}>
        <Entypo name="chevron-small-down" size={44} color={color} />
      </Animated.View>
    </Animated.View>
  );
};

export default SwipeButton;
