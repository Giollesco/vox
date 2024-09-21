import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { router, Stack } from 'expo-router';
import React from 'react';
import { Platform, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Directions, Gesture } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  SlideInDown,
  SlideOutDown,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ExerciseCard from '@/components/audio/gallery-card';
import { useAudioExercises } from '@/stores';
import type { AudioExercise } from '@/types';
import { colors, FocusAwareStatusBar, Text, View } from '@/ui';
import { SPRING_CONFIG } from '@/utils/config';
import { DUMMY_EXERCISE } from '@/utils/data';
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function AudioList() {
  // Hooks
  const { width, height } = useWindowDimensions();
  const { bottom, top } = useSafeAreaInsets();
  const { audioExercises } = useAudioExercises();

  // Variables
  const gestureActive = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const scrollDirection = useSharedValue(1); // 1 = right, -1 = left
  const lastScrollOffset = useSharedValue(0);

  function clamp(val: number, min: number, max: number) {
    return Math.min(Math.max(val, min), max);
  }
  // Styles
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }],
    };
  });

  const animatedWrapperStyle = useAnimatedStyle(() => {
    return {
      zIndex: gestureActive.value === 0 ? 2 : 0,
    };
  });

  // Data
  const exercices = [...audioExercises.exercises];
  // Split the interests into rows
  const rows: AudioExercise[][] = [];
  const itemsPerRow = Math.ceil(exercices?.length / 3);
  for (let i = 0; i < exercices?.length; i += itemsPerRow) {
    const row = exercices.slice(i, i + itemsPerRow);
    rows.push(row);
  }
  // In every row on first place add dummy item
  rows.forEach((row, index) => {
    row.unshift(DUMMY_EXERCISE);
    // In second row add dummy item on end
    if (index % 2 === 1) {
      row.push(DUMMY_EXERCISE);
    }
  });

  // Constants
  const CARD_WIDTH = width * 0.45;
  const CARD_HEIGHT = (height - top - bottom - 60) / 3;
  const ITEMS_PER_ROW = rows[0]?.length;
  const CONTAINER_HEIGHT = CARD_HEIGHT * rows?.length;
  const CONTAINER_WIDTH = CARD_WIDTH * ITEMS_PER_ROW - CARD_WIDTH * 0.85 + 4;
  const LEFT_CLAMP =
    -(CONTAINER_WIDTH - CARD_WIDTH) + width - CARD_WIDTH * 0.15;

  // Animated props
  const animatedBlurProps = useAnimatedProps(() => {
    return {
      intensity: Math.abs(gestureActive.value) * 5,
    };
  });

  // Gesture
  const gesture = Gesture.Fling()
    .enabled(gestureActive.value === 0)
    .direction(
      Directions.DOWN | Directions.UP | Directions.LEFT | Directions.RIGHT
    )
    .onBegin((event) => {
      startX.value = event.x;
      startY.value = event.y;
    })
    .onStart((event) => {
      let flingDirection: number = 0;
      let newOffsetX = offsetX.value;
      // Determine x fling direction
      if (event.x < startX.value) {
        flingDirection = 1;
        newOffsetX = -CARD_WIDTH;
      } else if (event.x > startX.value) {
        flingDirection = -1;
        newOffsetX = CARD_WIDTH;
      }
      gestureActive.value = withSpring(flingDirection, SPRING_CONFIG);
      offsetX.value = withTiming(
        clamp(offsetX.value + newOffsetX, LEFT_CLAMP, 0),
        {},
        () => {
          gestureActive.value = withSpring(0, SPRING_CONFIG);
        }
      );
    })
    .runOnJS(true);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <FocusAwareStatusBar />
      {/* Background */}
      <View
        className="flex-1"
        style={{ zIndex: 0, width, height, backgroundColor: colors.grey.light }}
      >
        {/* ---------------------------------- */}
        {/* Content */}
        {/* ---------------------------------- */}
        {/* <GestureDetector gesture={gesture}> */}
        <Animated.ScrollView
          className="flex-1"
          horizontal
          overScrollMode="never"
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={false}
          scrollEventThrottle={16}
          // decelerationRate={0.1}
          onScrollBeginDrag={(e) => {
            gestureActive.value = withTiming(1);
          }}
          onScrollEndDrag={() => {
            gestureActive.value = withTiming(0);
          }}
          onMomentumScrollBegin={(e) => {
            gestureActive.value = withTiming(1);
          }}
          onMomentumScrollEnd={() => {
            gestureActive.value = withTiming(0);
          }}
          onScroll={(e) => {
            // Calculate scroll direction
            const currentScrollOffset = e.nativeEvent.contentOffset.x;
            scrollDirection.value =
              currentScrollOffset > lastScrollOffset.value ? 1 : -1;
            lastScrollOffset.value = withTiming(currentScrollOffset);
          }}
          scrollToOverflowEnabled={false}
          contentContainerStyle={[
            {
              width: CONTAINER_WIDTH,
              flexWrap: 'wrap',
              flexDirection: 'row',
              paddingTop: top,
            },
            // animatedContainerStyle,
          ]}
        >
          {
            // Render the rows
            rows.map((row, rowIndex) => (
              <Animated.View
                key={rowIndex}
                className="flex-row justify-between"
                style={[{ width: CONTAINER_WIDTH }, animatedWrapperStyle]}
              >
                {row.map((exercise, index) => (
                  <Animated.View
                    key={index}
                    style={{
                      transform: [
                        {
                          translateX:
                            rowIndex % 2 === 0
                              ? -CARD_WIDTH * 0.85
                              : -CARD_WIDTH,
                        },
                      ],
                    }}
                  >
                    <ExerciseCard
                      key={index}
                      exercise={exercise}
                      index={rowIndex * (ITEMS_PER_ROW + 1) + index}
                      cardWidth={CARD_WIDTH}
                      cardHeight={CARD_HEIGHT}
                      gestureActive={gestureActive}
                      scrollDirection={scrollDirection}
                    />
                  </Animated.View>
                ))}
              </Animated.View>
            ))
          }

          {/* Animated blur view */}
          {Platform.OS === 'macos' && (
            <AnimatedBlurView
              style={{
                width: CONTAINER_WIDTH,
                height: CONTAINER_HEIGHT + CARD_HEIGHT,
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1,
              }}
              animatedProps={animatedBlurProps}
            />
          )}
        </Animated.ScrollView>
        {/* </GestureDetector> */}

        {/* Footer */}
        <Animated.View
          entering={SlideInDown.duration(1000)}
          exiting={SlideOutDown.duration(200)}
          style={{
            width,
            height: bottom + 60,
            position: 'absolute',
            zIndex: 2,
            bottom: 0,
            left: 0,
          }}
        >
          <BlurView style={{ height: bottom + 60 }}>
            <Animated.View
              entering={FadeIn.duration(750)}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 16,
                paddingHorizontal: 20,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.navigate('/(app)')}
                hitSlop={{ bottom: 12, top: 12, left: 12, right: 12 }}
                style={{ width: 40 }}
              >
                <Ionicons name="arrow-back" size={20} color="black" />
              </TouchableOpacity>
              <Text className="text-center text-xl" weight="semiBold">
                Audio vježbe
              </Text>
              <Text
                className="text-center text-xl"
                weight="semiBold"
                style={{ width: 40 }}
              >
                {audioExercises.total}
              </Text>
            </Animated.View>
          </BlurView>
        </Animated.View>
      </View>
    </>
  );
}
