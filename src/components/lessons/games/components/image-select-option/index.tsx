import { GameState } from '@/types';
import { Image, TouchableOpacity, View } from '@/ui';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import * as React from 'react';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const AnimatedIcon = Animated.createAnimatedComponent(MaterialIcons);

type Props = {
  source: string;
  selected: boolean;
  baseBackgroundColor?: string;
  activeBackgroundColor: string;
  gameState: GameState;
  onSelect: () => void;
};

const ImageSelectOption = ({
  source,
  selected,
  activeBackgroundColor,
  gameState, // Destructure gameState
  onSelect,
}: Props) => {
  // State
  const baseBackgroundColor = 'transparent';
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

  const animatedBorderStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      [baseBackgroundColor, activeBackgroundColor]
    );
    return { borderColor };
  });

  const iconAnimatedProps = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [baseBackgroundColor, activeBackgroundColor]
    );
    return { color };
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
            height: '100%',
            alignItems: 'center',
            flexDirection: 'row',
            width: '100%',
          },
        ]}
      >
        <Animated.View
          style={[
            {
              height: '100%',
              borderRadius: 24,
              width: '100%',
              overflow: 'hidden',
            },
          ]}
        >
          <Image source={source} style={{ width: '100%', height: '100%' }} />
        </Animated.View>
        <Animated.View
          style={[
            {
              height: '100%',
              borderRadius: 24,
              width: '100%',
              overflow: 'hidden',
              position: 'absolute',
              opacity: 0.25,
            },
            animatedStyle,
          ]}
        />
        <Animated.View
          style={[
            {
              height: '100%',
              borderRadius: 24,
              width: '100%',
              overflow: 'hidden',
              position: 'absolute',
              borderWidth: 4,
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
            },
            animatedBorderStyle,
          ]}
        >
          <AnimatedIcon
            animatedProps={iconAnimatedProps}
            name="radio-button-checked"
            size={24}
            style={{ marginRight: 10, marginTop: 10 }}
          />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(ImageSelectOption);
