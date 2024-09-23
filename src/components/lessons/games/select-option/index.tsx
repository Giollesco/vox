import * as Haptics from 'expo-haptics';
import * as React from 'react';
import { Text, TouchableOpacity, View } from '@/ui';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { GameState } from '@/types';

type Props = {
  text: string;
  selected: boolean;
  baseBackgroundColor?: string;
  activeBackgroundColor: string;
  gameState: GameState;
  onSelect: () => void;
};

const SelectOption = ({
  text,
  selected,
  activeBackgroundColor,
  gameState, // Destructure gameState
  onSelect,
}: Props) => {
  // State
  const baseBackgroundColor = '#ffffff30';
  const progress = useSharedValue(0);

  React.useEffect(() => {
    // Update animation when either selected or gameState changes
    progress.value = withTiming(selected ? 1 : 0, { duration: 300 });
  }, [selected, gameState]); // Add gameState to the dependency array

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [baseBackgroundColor, activeBackgroundColor]
    );
    return { backgroundColor };
  });

  // Functions
  function handleSelect() {
    onSelect();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  return (
    <TouchableOpacity onPress={handleSelect} activeOpacity={0.8}>
      <View
        style={[
          {
            height: 64,
            alignItems: 'center',
            flexDirection: 'row',
            width: '100%',
          },
        ]}
      >
        <Animated.View
          style={[
            {
              height: 64,
              borderRadius: 24,
              width: '100%',
            },
            animatedStyle, // Apply animated background style
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
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(SelectOption);
