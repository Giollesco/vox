import {
  SharedValue,
  useAnimatedStyle,
  withSpring,
  WithSpringConfig,
  withTiming,
} from 'react-native-reanimated';

const SPRING_CONFIG: WithSpringConfig = {
  damping: 14,
  mass: 1,
  stiffness: 100,
  velocity: 1,
};

export const _blurViewStyles = (blurViewOpacity: SharedValue<any>) => {
  return useAnimatedStyle(() => {
    return { opacity: blurViewOpacity.value };
  });
};

export const _containerZIndex = (showingDetails: SharedValue<boolean>) => {
  return useAnimatedStyle(() => {
    return { zIndex: showingDetails.value ? 10 : withTiming(0) }; //withTiming -> wait for the closing animation
  });
};

export const _boxWrapperStyles = (
  boxWrapperPositionHorizontal: SharedValue<any>,
  boxWrapperPositionTop: SharedValue<any>,
  boxWrapperHeight: SharedValue<any>,
  scrollViewScale: SharedValue<any>
) => {
  return useAnimatedStyle(() => {
    return {
      left: boxWrapperPositionHorizontal.value,
      right: boxWrapperPositionHorizontal.value,
      top: boxWrapperPositionTop.value,
      height: boxWrapperHeight.value,
      transform: [{ scale: scrollViewScale.value }],
    };
  });
};

export const _scrollViewStyles = (scrollViewBorderRadius: SharedValue<any>) => {
  return useAnimatedStyle(() => {
    return { borderRadius: scrollViewBorderRadius.value };
  });
};

export const _thumbnailStyles = (thumbnailHeight: SharedValue<any>) => {
  return useAnimatedStyle(() => {
    return { height: thumbnailHeight.value };
  });
};

export const _titleFontSize = (showingDetails: SharedValue<boolean>) => {
  return useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: showingDetails.value
            ? withSpring(1.2, SPRING_CONFIG)
            : withSpring(1, SPRING_CONFIG),
        },
        {
          translateX: showingDetails.value
            ? withSpring(20, SPRING_CONFIG)
            : withSpring(0, SPRING_CONFIG),
        },
        {
          translateY: showingDetails.value
            ? withSpring(40, SPRING_CONFIG)
            : withSpring(0, SPRING_CONFIG),
        },
      ],
    };
  });
};

export const _contentPaddingStyles = (
  showingDetails: SharedValue<boolean>,
  top: number
) => {
  return useAnimatedStyle(() => {
    return {
      paddingTop: showingDetails.value
        ? withSpring(top, SPRING_CONFIG)
        : withSpring(32, SPRING_CONFIG),
    };
  });
};
