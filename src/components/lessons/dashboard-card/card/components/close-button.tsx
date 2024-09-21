import { AntDesign } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/ui';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

interface CloseButtonProps {
  opacity: Animated.SharedValue<number>;
  hideAppDetails: () => void;
}

const CloseButton = ({ opacity, hideAppDetails }: CloseButtonProps) => {
  // Hooks
  const { top } = useSafeAreaInsets();
  const closeBtnStyles = useAnimatedStyle(() => {
    return { opacity: opacity.value };
  });

  return (
    <Animated.View style={[styles.closeBtnWrapper, { top }, closeBtnStyles]}>
      <Pressable onPress={hideAppDetails}>
        <AnimatedBlurView
          intensity={100}
          tint="light"
          style={[styles.closeBtn]}
        >
          <AntDesign name="close" size={20} color="black" />
        </AnimatedBlurView>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  closeBtnWrapper: {
    position: 'absolute',
    top: 20,
    right: 18,
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
  },

  closeBtn: {
    position: 'absolute',
    top: 0,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[200],
  },
});

export default CloseButton;
