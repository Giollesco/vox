import {
  Canvas,
  Fill,
  Shader,
  useClock,
  vec,
} from '@shopify/react-native-skia';
import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import {
  Directions,
  FlingGestureHandler,
  State,
} from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  FadeIn,
  FadeOut,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

import type { Word } from '@/types';
import { colors, Text, View } from '@/ui';
import { getRandomBetween } from '@/utils/functions';

import { useExerciseCardAnimatedStyles } from './animated-styles';
import { activeWaveShader } from './shaders';
import { ExerciseCardStar } from './star';

interface CardProps {
  maxVisibleItems: number;
  item: Word;
  recordedText: string | undefined;
  index: number;
  dataLength: number;
  animatedValue: SharedValue<number>;
  currentIndex: SharedValue<number>;
  prevIndex: SharedValue<number>;
  speechProgress: SharedValue<number>;
  width: number;
  height: number;
  error: string | undefined;
  whisperLoading: boolean;
  gestureEnabled?: boolean;
}

const AudioExerciseCard = ({
  maxVisibleItems,
  item,
  recordedText,
  index,
  dataLength,
  animatedValue,
  currentIndex,
  speechProgress,
  prevIndex,
  height,
  width,
  whisperLoading,
  error,
  gestureEnabled = true,
}: CardProps) => {
  // Hooks
  const rotation = useMemo(() => getRandomBetween(5), []);
  const { animatedStyle, animatedWrapperStyle } = useExerciseCardAnimatedStyles(
    {
      animatedValue,
      currentIndex,
      index,
      maxVisibleItems,
      prevIndex,
      rotation,
    }
  );

  const clock = useClock();
  const uniforms = useDerivedValue(
    () => ({
      iResolution: vec(width - 32, height / 2 + 24 - 32 - 16),
      iTime: clock.value * 0.001,
      iProgress: speechProgress.value,
    }),
    [clock, speechProgress]
  );

  return (
    <FlingGestureHandler
      key="up"
      enabled={gestureEnabled}
      direction={Directions.UP}
      onHandlerStateChange={(ev) => {
        if (ev.nativeEvent.state === State.END) {
          if (currentIndex.value !== 0) {
            animatedValue.value = withTiming((currentIndex.value -= 1));
            prevIndex.value = currentIndex.value - 1;
          }
        }
      }}
    >
      <FlingGestureHandler
        key="down"
        enabled={gestureEnabled}
        direction={Directions.DOWN}
        onHandlerStateChange={(ev) => {
          if (ev.nativeEvent.state === State.END) {
            if (currentIndex.value !== dataLength - 1) {
              animatedValue.value = withTiming((currentIndex.value += 1));
              prevIndex.value = currentIndex.value;
            }
          }
        }}
      >
        <Animated.View
          style={[
            {
              zIndex: dataLength - index,
              width,
              height,
            },
            styles.container,
            animatedStyle,
          ]}
        >
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { width, height },
              styles.wrapper,
              animatedWrapperStyle,
            ]}
          >
            <View className="flex-1 gap-4">
              <View
                className="flex-col justify-between"
                style={{
                  height: height / 2 - 24,
                }}
              >
                {/* Header */}
                <View className="w-full flex-row items-center justify-between">
                  <Text className="text-lg">{item.partOfSpeech}</Text>
                  <ExerciseCardStar difficulty={item.difficulty} />
                </View>

                {/* Word */}
                <View className="w-full flex-row items-end justify-between">
                  <View
                    className="flex-col items-start"
                    style={{ width: width - 100 - 16 }}
                  >
                    <View
                      key={`recorded-${recordedText}`}
                      style={{ flexDirection: 'row' }}
                    >
                      {error ? (
                        <Text className="text-2xl" style={{ color: 'tomato' }}>
                          {error}
                        </Text>
                      ) : (
                        recordedText?.split('').map((letter, index) => (
                          <Animated.View
                            key={index}
                            entering={FadeIn.delay(40 * index)}
                            exiting={FadeOut}
                          >
                            <Text
                              className="text-5xl"
                              style={{
                                color:
                                  recordedText === item.text
                                    ? colors.success['300']
                                    : '#ddd',
                              }}
                            >
                              {letter}
                            </Text>
                          </Animated.View>
                        ))
                      )}
                    </View>

                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <Text className="text-5xl">{item.text}</Text>
                      {whisperLoading && <ActivityIndicator />}
                    </View>
                    <Text className="text-lg opacity-50">
                      {item.description}
                    </Text>
                  </View>
                  <Text
                    className="text-lg"
                    style={{ width: 100 - 16, textAlign: 'right' }}
                  >
                    {item.pronunciation}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  height: height / 2 + 24 - 32 - 16,
                  backgroundColor: colors.grey.light,
                  borderRadius: 24,
                  overflow: 'hidden',
                }}
              >
                <Canvas
                  style={{
                    width: width - 32,
                    height: height / 2 + 24 - 32 - 16,
                  }}
                >
                  <Fill>
                    <Shader source={activeWaveShader!} uniforms={uniforms} />
                  </Fill>
                </Canvas>
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      </FlingGestureHandler>
    </FlingGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 8,
    bottom: 4,
    borderRadius: 32,
    // borderWidth: 1,
    // borderColor: colors.grey.dark,
  },
  wrapper: {
    alignItems: 'center',
    borderRadius: 32,
    padding: 16,
    overflow: 'hidden',
  },
});

export default AudioExerciseCard;
