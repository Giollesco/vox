import { Text, View } from '@/ui';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type CardButtonProps = {
  icon: string;
  active: boolean;
  title: string;
  subtitle: string;
  onPress: () => void;
};

const CardButton: React.FC<CardButtonProps> = ({
  icon,
  active,
  title,
  subtitle,
  onPress,
}) => {
  // Hooks
  const isActive = useSharedValue(false);

  // Gesture
  const gesture = Gesture.Tap()
    .maxDuration(10000)
    .onTouchesDown(() => {
      isActive.value = true;
    })
    .onTouchesUp(() => {
      runOnJS(onPress)();
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    })
    .onFinalize(() => {
      isActive.value = false;
    });

  // Style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(isActive.value ? 0.95 : 1),
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={animatedStyle}>
        <View
          className={`flex-1 flex-col gap-4 border p-6 rounded-6xl ${
            active ? 'border-primary-500' : 'border-zinc-800'
          }`}
        >
          <View className="flex-row gap-4">
            <Ionicons name={icon as any} size={24} color="white" />
            <Text
              weight="medium"
              className="text-white text-2xl"
              style={{ marginTop: -4 }}
            >
              {title}
            </Text>
          </View>
          <Text weight="light" className="text-white opacity-50">
            {subtitle}
          </Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

export default CardButton;
