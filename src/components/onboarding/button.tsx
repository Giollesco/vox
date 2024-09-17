import { View } from '@/ui';
import { SPRING_CONFIG } from '@/utils/config';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as Haptics from 'expo-haptics';
import * as React from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type Props = {
  disabled: boolean;
  icon: (typeof AntDesign)['name'];
  onPress: () => void;
};
export const OnboardingButton = ({ disabled, icon, onPress }: Props) => {
  // Hooks
  const isActive = useSharedValue(false);

  // Gesture
  const gesture = Gesture.Tap()
    .enabled(!disabled)
    .maxDuration(10000)
    .onTouchesDown(() => {
      isActive.value = true;
    })
    .onTouchesUp(() => {
      if (onPress) {
        runOnJS(onPress)();
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
      }
    })
    .onFinalize(() => {
      isActive.value = false;
    });

  // Style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      // opacity: withSpring(isActive.value ? 0.5 : 1),
      transform: [
        {
          scale: withSpring(isActive.value ? 0.9 : 1, SPRING_CONFIG),
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={animatedStyle}>
        <Animated.View style={{ opacity: disabled ? 0.25 : 1 }}>
          <View className="rounded-full border border-gray-500 h-[72] w-[72] justify-center ">
            <AntDesign
              name={icon as any}
              size={26}
              color="white"
              style={{ paddingLeft: 22 }}
            />
          </View>
          {/* <View
            className={`rounded-full border${
              disabled ? '' : '0'
            } border-gray-500 h-[72] w-[72] justify-center bg-${
              disabled ? 'transparent' : 'white'
            }`}
          >
            <AntDesign
              name={icon as any}
              size={26}
              color={disabled ? '#fff' : '#000'}
              style={{ paddingLeft: 22 }}
            />
          </View> */}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};
