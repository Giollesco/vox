import type { SharedValue } from 'react-native-reanimated';
import { useAnimatedProps } from 'react-native-reanimated';

export const _scrollViewAnimatedProps = (
  scrollViewScrollEnabled: SharedValue<any>,
  scrollViewBounces: SharedValue<any>,
  pressedScale: SharedValue<any>
) => {
  return useAnimatedProps(() => {
    return {
      scrollEnabled: scrollViewScrollEnabled.value,
      bounces: scrollViewBounces.value,
      transform: [{ scale: pressedScale.value }],
    };
  });
};

export const _Android_thumbanailImageStyles = (
  scrollViewBorderRadius: SharedValue<any>,
  Android_ThumbnailBorderRadiusBottom: SharedValue<any>
) => {
  return useAnimatedProps(() => {
    return {
      borderTopLeftRadius: scrollViewBorderRadius.value,
      borderTopRightRadius: scrollViewBorderRadius.value,
      borderBottomLeftRadius: Android_ThumbnailBorderRadiusBottom.value,
      borderBottomRightRadius: Android_ThumbnailBorderRadiusBottom.value,
    };
  });
};

export const _panGestureHandlerProps = (showingDetails: SharedValue<any>) => {
  return useAnimatedProps(() => {
    return { enabled: showingDetails.value };
  });
};
