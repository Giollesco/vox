import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as React from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
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
  activeBackgroundColor?: string;
  onSelect: () => void;
};
export const SelectOption = ({
  text,
  selected,
  baseBackgroundColor = '#ffffff30',
  activeBackgroundColor,
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
        [baseBackgroundColor, activeBackgroundColor || colors.primary[500]]
      ),
      transform: [
        {
          scale: withTiming(isActive.value ? 0.95 : 1),
        },
      ],
    };
  });

  const animatedParentStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(progress.value, [0, 1], [-42, 0]),
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
          animatedParentStyle,
          {
            height: 64,
            alignItems: 'center',
            flexDirection: 'row',
            width: '100%',
          },
        ]}
      >
        <Feather
          name="arrow-right"
          size={32}
          color={activeBackgroundColor ? colors.black : colors.primary[500]}
          style={{ marginRight: 10 }}
        />
        <Animated.View
          style={[
            animatedStyle,
            { height: 64, borderRadius: 24, width: '100%' },
          ]}
        >
          <Text
            className={`text-lg`}
            weight="medium"
            style={{ marginLeft: 20, height: 64, lineHeight: 62 }}
          >
            {text}
          </Text>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};
