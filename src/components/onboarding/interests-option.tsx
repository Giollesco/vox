import * as Haptics from 'expo-haptics';
import * as React from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors, Text } from '@/ui';

type Props = {
  text: string;
  selected: boolean;
  baseBackgroundColor?: string;
  onSelect: () => void;
};
export const IntersetOption = ({
  text,
  selected,
  baseBackgroundColor = '#ffffff30',
  onSelect,
}: Props) => {
  // Hooks
  const progress = useSharedValue(0);
  const isActive = useSharedValue(false);

  // Effects
  React.useEffect(() => {
    if (selected) {
      progress.value = withTiming(1);
    } else {
      progress.value = withTiming(0);
    }
  }, [selected]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [baseBackgroundColor, colors.primary[500]]
      ),
      transform: [
        {
          scale: withTiming(isActive.value ? 0.95 : 1),
        },
      ],
    };
  });

  // Gesture
  const gesture = Gesture.Tap()
    .maxDuration(10000)
    .onTouchesDown(() => {
      isActive.value = true;
    })
    .onTouchesUp(() => {
      runOnJS(onSelect)();
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    })
    .onFinalize(() => {
      isActive.value = false;
    });

  // Style

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          {
            height: 64,
            alignItems: 'center',
            flexDirection: 'row',
          },
        ]}
      >
        <Animated.View
          style={[animatedStyle, { height: 64, borderRadius: 24 }]}
        >
          <Text
            className={`text-lg`}
            weight="medium"
            style={{ paddingHorizontal: 20, height: 64, lineHeight: 62 }}
          >
            {text}
          </Text>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};
