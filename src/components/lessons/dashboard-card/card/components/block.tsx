// Animated
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import React, { useEffect } from 'react';
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { PanGestureHandler, ScrollView } from 'react-native-gesture-handler';
import type { WithSpringConfig } from 'react-native-reanimated';
import Animated, {
  Extrapolate,
  interpolate,
  measure,
  runOnJS,
  runOnUI,
  scrollTo,
  useAnimatedGestureHandler,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/core';
// Components
import { colors, Text } from '@/ui';
import { STARTING_POINTS } from '@/utils/data';

import {
  _Android_thumbanailImageStyles,
  _panGestureHandlerProps,
  _scrollViewAnimatedProps,
} from './Animated/Props';
import {
  _blurViewStyles,
  _boxWrapperStyles,
  _containerZIndex,
  _contentPaddingStyles,
  _scrollViewStyles,
  _thumbnailStyles,
} from './Animated/Styles';
import CloseButton from './close-button';
import { LineGraph } from './line-graph';
import DashboardLessonContent from '@/app/lessons/dashboard-content';

// Constants
export const THUMBNAIL_SCALE_FACTOR = 1.35;
export const DESCRIPTION_HEIGHT = 40;
const WINDOW = Dimensions.get('window');
const SPRING_CONFIG: WithSpringConfig = {
  damping: 14,
  mass: 1,
  stiffness: 100,
  velocity: 1,
};

// Animated components
//@ts-ignore
const AnimatedPanGestureHandler =
  Animated.createAnimatedComponent(PanGestureHandler);
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

// Props
interface IProps {
  height: number;
  width: number;
  isShowingDetails: Animated.SharedValue<boolean>;
  defaultOpen: boolean;
  showingStateChanged: () => void;
}

const Block = ({
  height,
  width,
  isShowingDetails,
  defaultOpen,
  showingStateChanged,
}: IProps) => {
  // Hooks
  const { top } = useSafeAreaInsets();
  const { account } = useAuth();

  // Variables
  const isShowingContent = useDerivedValue(() => {
    return isShowingDetails.value;
  });
  const boxWrapperRef = useAnimatedRef<Animated.View>();
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const showingDetails = useSharedValue(false) as Animated.SharedValue<boolean>;
  const blurViewOpacity = useSharedValue(0);
  const boxWrapperHeight = useSharedValue(height);
  const boxWrapperPositionHorizontal = useSharedValue(0);
  const boxWrapperPositionTop = useSharedValue(0);
  const scrollViewBorderRadius = useSharedValue(32);
  const scrollViewScale = useSharedValue(1);
  const scrollViewScrollEnabled = useSharedValue(false);
  const scrollViewBounces = useSharedValue(false);
  const pressedScale = useSharedValue(1);
  const thumbnailHeight = useSharedValue(height);
  const Android_ThumbnailBorderRadiusBottom = useSharedValue(32); //overflow: 'hidden' not working on android
  const closeBtnOpacity = useSharedValue(0);

  // Effects
  useEffect(() => {
    if (defaultOpen) {
      setTimeout(() => {
        showAppDetails();
      }, 500);
    }
  }, [defaultOpen]);

  function showAppDetails() {
    if (isShowingContent.value || showingDetails.value) return;
    showingStateChanged();
    runOnUI(() => {
      'worklet';
      showingDetails.value = true;
      blurViewOpacity.value = withDelay(150, withTiming(1, { duration: 150 }));

      boxWrapperHeight.value = withSpring(WINDOW.height, SPRING_CONFIG);
      const pageX = measure(boxWrapperRef)?.pageX || 0;
      const pageY = measure(boxWrapperRef)?.pageY || 0;
      boxWrapperPositionHorizontal.value = withSpring(-pageX, SPRING_CONFIG);
      boxWrapperPositionTop.value = withSpring(-pageY, SPRING_CONFIG);

      scrollViewBorderRadius.value = withSpring(0, SPRING_CONFIG);
      scrollViewScrollEnabled.value = true;

      thumbnailHeight.value = withSpring(
        height * THUMBNAIL_SCALE_FACTOR,
        SPRING_CONFIG
      );
      Android_ThumbnailBorderRadiusBottom.value = withSpring(0, SPRING_CONFIG);
      closeBtnOpacity.value = withSpring(1, SPRING_CONFIG);
    })();
  }

  function hideAppDetails() {
    showingStateChanged();
    runOnUI(() => {
      'worklet';
      showingDetails.value = false;
      blurViewOpacity.value = withTiming(0, { duration: 250 });

      boxWrapperHeight.value = withSpring(height, SPRING_CONFIG);
      boxWrapperPositionHorizontal.value = withSpring(0, SPRING_CONFIG);
      boxWrapperPositionTop.value = withSpring(0, SPRING_CONFIG);

      scrollViewBorderRadius.value = withSpring(32, SPRING_CONFIG);
      scrollViewScrollEnabled.value = false;
      scrollViewScale.value = withSpring(1, SPRING_CONFIG);

      thumbnailHeight.value = withSpring(height, SPRING_CONFIG);
      Android_ThumbnailBorderRadiusBottom.value = withSpring(32, SPRING_CONFIG);
      closeBtnOpacity.value = withTiming(0, { duration: 100 });
      scrollTo(scrollViewRef, 0, 0, true);
    })();
  }

  // Animated Styles
  const blurViewStyles = _blurViewStyles(blurViewOpacity);
  const containerZIndex = _containerZIndex(isShowingContent);
  const boxWrapperStyles = _boxWrapperStyles(
    boxWrapperPositionHorizontal,
    boxWrapperPositionTop,
    boxWrapperHeight,
    scrollViewScale
  );
  const scrollViewStyles = _scrollViewStyles(scrollViewBorderRadius);
  const thumbnailStyles = _thumbnailStyles(thumbnailHeight);
  const contentPaddingStyles = _contentPaddingStyles(
    isShowingContent,
    Math.max(top * 1.75, 32)
  );

  // Animated props
  const scrollViewAnimatedProps = _scrollViewAnimatedProps(
    scrollViewScrollEnabled,
    scrollViewBounces,
    pressedScale
  );
  const Android_thumbanailImageStyles = _Android_thumbanailImageStyles(
    scrollViewBorderRadius,
    Android_ThumbnailBorderRadiusBottom
  );
  const panGestureHandlerProps = _panGestureHandlerProps(showingDetails);

  // Gestures
  const gestureEventHandler = useAnimatedGestureHandler({
    onActive: ({ translationY }) => {
      const inputRange = [0, 100];
      if (translationY > 0) {
        const scaleValue = interpolate(
          translationY,
          inputRange,
          [1, 0.8],
          Extrapolate.CLAMP
        );
        scrollViewScale.value = scaleValue;

        const borderRadius = interpolate(
          translationY,
          inputRange,
          [0, 32],
          Extrapolate.CLAMP
        );
        scrollViewBorderRadius.value = borderRadius;

        const opacityValue = interpolate(
          translationY,
          inputRange,
          [1, 0],
          Extrapolate.CLAMP
        );
        closeBtnOpacity.value = opacityValue;
      }
    },
    onEnd: () => {
      if (scrollViewScale.value > 0.85) {
        scrollViewScale.value = withTiming(1);
        scrollViewBorderRadius.value = withTiming(0);
        closeBtnOpacity.value = withTiming(1);
      } else runOnJS(hideAppDetails)();
    },
  });

  return (
    <>
      {/* Blur view */}
      <Animated.View
        pointerEvents="none"
        style={[styles.blurViewWrapper, blurViewStyles]}
      >
        {Platform.OS !== 'android' ? (
          <BlurView tint="default" intensity={100} style={{ flex: 1 }} />
        ) : (
          <View style={{ flex: 1, backgroundColor: '#000', opacity: 0.5 }} />
        )}
      </Animated.View>

      <Animated.View style={[styles.container, containerZIndex, { height }]}>
        <Animated.View
          style={[boxWrapperStyles, { position: 'absolute' }]}
          ref={boxWrapperRef}
        >
          <AnimatedScrollView
            style={[scrollViewStyles, { backgroundColor: '#fff' }]}
            animatedProps={scrollViewAnimatedProps}
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef as any}
            onScroll={useAnimatedScrollHandler((event) => {
              const scrollViewHeight = measure(scrollViewRef)?.height || 0;
              scrollViewBounces.value =
                event.contentOffset.y > scrollViewHeight / 2;
            })}
            scrollEventThrottle={16}
            scrollToOverflowEnabled={false}
          >
            <AnimatedPanGestureHandler
              onGestureEvent={gestureEventHandler}
              animatedProps={panGestureHandlerProps}
            >
              <Pressable
                onPress={() => {
                  pressedScale.value = withTiming(1);
                  showAppDetails();
                }}
                onTouchStart={() =>
                  (pressedScale.value = withTiming(
                    showingDetails.value ? 1 : 0.98
                  ))
                }
                onTouchCancel={() => (pressedScale.value = withTiming(1))}
                onTouchEnd={() => (pressedScale.value = withTiming(1))}
              >
                <Animated.View style={thumbnailStyles}>
                  {/* Image */}
                  <Animated.View
                    style={
                      Platform.OS === 'android'
                        ? [
                            Android_thumbanailImageStyles,
                            { overflow: 'hidden', flex: 1 },
                          ]
                        : { overflow: 'hidden', flex: 1 }
                    }
                  >
                    {/* <Image
                      source={{ uri: lesson.imageUrl }}
                      style={styles.blockStyle}
                      resizeMode="cover"
                    /> */}
                    <Animated.View
                      style={[styles.blockStyle, contentPaddingStyles]}
                    >
                      {/* Top row */}
                      <View
                        className="w-full justify-between align-middle"
                        // style={{ alignItems: 'center' }}
                      >
                        <MotiView
                          from={{ opacity: 0, bottom: -10 }}
                          animate={{ opacity: 1, bottom: 0 }}
                          delay={150}
                        >
                          <Text
                            numberOfLines={2}
                            weight="semiBold"
                            style={{
                              fontSize: 14,
                              opacity: 0.5,
                              marginBottom: 8,
                            }}
                          >
                            {`Razina ${account?.startingPoint}: ${
                              STARTING_POINTS.find(
                                (point) =>
                                  point.level === account?.startingPoint
                              )?.text
                            }`}
                          </Text>
                        </MotiView>
                        <MotiView
                          from={{ opacity: 0, bottom: -10 }}
                          animate={{ opacity: 1, bottom: 0 }}
                          delay={100}
                          style={{ marginBottom: 8 }}
                        >
                          <Text
                            weight="semiBold"
                            style={{
                              fontSize: 36,
                              lineHeight: 36,
                            }}
                          >
                            Učimo engleski{'\n'}zajedno
                            {/* // TODO: Add langauge based on onboarding info */}
                          </Text>
                        </MotiView>
                      </View>

                      {/* Bottom row */}
                      <View
                        className="w-full flex-row gap-8"
                        style={{
                          gap: 24,
                        }}
                      >
                        <MotiView
                          from={{ opacity: 0, bottom: -10 }}
                          animate={{ opacity: 1, bottom: 0 }}
                          delay={150}
                        >
                          <Text style={{ fontSize: 13, opacity: 0.35 }}>
                            Broj riješenih lekcija
                          </Text>
                          <Text weight="semiBold" style={{ fontSize: 16 }}>
                            16 lekcija
                          </Text>
                        </MotiView>
                        <MotiView
                          from={{ opacity: 0, bottom: -10 }}
                          animate={{ opacity: 1, bottom: 0 }}
                          delay={200}
                        >
                          <Text style={{ fontSize: 13, opacity: 0.35 }}>
                            Broj preostalih lekcija
                          </Text>
                          <Text weight="semiBold" style={{ fontSize: 16 }}>
                            4 lekcija
                          </Text>
                        </MotiView>
                      </View>

                      {/* Line graph */}
                      <View
                        style={{
                          height: height / 2 - 48,
                          paddingVertical: 24,
                          paddingBottom: 16,
                        }}
                      >
                        <LineGraph progress={0.5} />
                      </View>
                    </Animated.View>
                  </Animated.View>
                </Animated.View>
              </Pressable>
            </AnimatedPanGestureHandler>
            <DashboardLessonContent
              isShowingDetails={isShowingContent}
              height={height}
            />
          </AnimatedScrollView>

          {/* Close button */}
          {Platform.OS !== 'android' && (
            <CloseButton
              opacity={closeBtnOpacity}
              hideAppDetails={hideAppDetails}
            />
          )}
        </Animated.View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  blurViewWrapper: {
    position: 'absolute',
    left: -1000,
    right: 0,
    top: -1000,
    bottom: 0,
    zIndex: 1,
    width: 4000,
    height: 4000,
  },
  container: {
    position: 'relative',
    width: '100%',
    zIndex: 11,
  },

  titleWrapper: {
    position: 'absolute',
    top: 20,
    width: WINDOW.width - 66,
    paddingHorizontal: 15,
    zIndex: 10,
  },
  title: {
    fontSize: WINDOW.width * 0.06,
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
  blockStyle: {
    flex: 1,
    zIndex: 5,
    backgroundColor: colors.primary['500'],
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  descriptionWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    // maxWidth: WINDOW.width * 0.85,
    zIndex: 10,
    // backgroundColor: '#00000040',
    overflow: 'hidden',
  },
  description: {
    fontSize: WINDOW.width * 0.04,
    opacity: 0.75,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
});

export default Block;
