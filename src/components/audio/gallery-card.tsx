import { FontAwesome } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import { Link, router } from 'expo-router';
import React from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  FadeInDown,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { useAuth } from '@/core';
import type { AudioExercise } from '@/types';
import { Text, View } from '@/ui';

interface ExerciseCardProps {
  exercise: AudioExercise;
  cardWidth: number;
  cardHeight: number;
  index: number;
  gestureActive: SharedValue<number>;
  scrollDirection?: SharedValue<number>;
  customData?: {
    title: string;
    description: string;
    color: string;
    footerText?: string;
  };
}

export default function ExerciseCard({
  exercise,
  index,
  cardHeight,
  cardWidth,
  gestureActive,
  scrollDirection,
  customData,
}: ExerciseCardProps) {
  // Constants
  const isDummy = exercise.title === 'DUMMY';
  const colors = ['#00AFE8', '#86BE80', '#FBB1FF', '#ADCDC0', '#DEFE4A'];
  const color = customData
    ? customData.color
    : isDummy
    ? '#aaa'
    : colors[index % colors.length];
  const sharedTransitionTag = `audio-exercise-card-${index}`;
  const letterSize = cardHeight - 40 - 8 - 36; // -40 for the header, -8 for the margin, -32 for the footer
  // @ts-ignore
  const id = exercise.$id;

  // Hooks
  const { account } = useAuth();
  const isActive = useSharedValue<number>(0);
  const gestureEnabled = gestureActive.value !== 0 || !isDummy;

  // Functions
  function navigateToExercise() {
    if (customData) {
      router.replace('/audio');
    } else {
      router.push({
        pathname: '/audio/[exercise]',
        // @ts-ignore
        params: {
          exerciseName: exercise.title,
          color,
          sharedTransitionTag,
        },
      });
    }
  }

  // Gesture
  const gesture = Gesture.Tap()
    .enabled(gestureEnabled)
    .onTouchesDown(() => {
      isActive.value = 1;
    })
    .onTouchesUp(() => {
      runOnJS(navigateToExercise)();
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
    })
    .onFinalize(() => {
      isActive.value = 0;
    });

  // Styles
  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 850 },
        {
          rotateZ:
            gestureActive.value * 2 * (scrollDirection?.value || 1) + 'deg',
        },
        {
          rotateY:
            gestureActive.value * 15 * (scrollDirection?.value || 1) + 'deg',
        },
      ],
    };
  });

  // Style
  // const animatedStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [
  //       {
  //         scale: withTiming(isActive.value === 1 ? 0.9 : 1),
  //       },
  //     ],
  //   };
  // });

  return (
    <Link
      disabled={isDummy || gestureActive.value !== 0}
      href={{
        pathname: '/audio/[exercise]',
        // @ts-ignore
        params: {
          exerciseName: exercise.title,
          color,
          sharedTransitionTag,
        },
      }}
      asChild
    >
      <GestureDetector gesture={gesture}>
        <Animated.View
          entering={FadeInDown.duration(index === -1 ? 0 : 500).delay(
            index === -1 ? 0 : index * 25
          )}
          style={[
            {
              width: cardWidth,
              height: cardHeight,
              padding: customData ? 0 : 4,
            },
            // animatedStyle,
          ]}
        >
          <Animated.View
            className="rounded-4xl"
            style={[
              {
                backgroundColor: color,
                width: '100%',
                height: '100%',
                padding: 16,
                paddingVertical: 12,
                justifyContent: 'space-between',
              },
              animatedCardStyle,
            ]}
          >
            <View style={{ height: 52 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Text className="text-lg" weight="semiBold" numberOfLines={1}>
                  {customData ? customData.title : exercise.title}
                </Text>
                {account?.interests.includes(exercise.title) && (
                  <FontAwesome name="star" size={16} color="black" />
                )}
              </View>
              <Text className="text-sm" style={{ marginTop: -4 }}>
                {customData
                  ? customData.description
                  : `${exercise.words.length} riječi`}
              </Text>
            </View>
            <View
              style={{
                height: letterSize - 20, // - 20 to center the text
                width: cardWidth - 8,
                top: 60,
                left: 0,
                justifyContent: 'flex-end',
                position: 'absolute',
                overflow: 'hidden',
              }}
            >
              <View
                className="h-full w-full"
                style={{
                  transform: [{ rotate: '-15deg' }],
                  top: -40,
                  left: -10,
                }}
              >
                {exercise.words.map((word, index) => (
                  <Text
                    key={`word-${word.text}-${index}`}
                    weight="black"
                    style={{
                      fontSize: 64,
                      height: 44,
                      lineHeight: 56,
                      // lineHeight: letterSize + 20, // + 20 to center the text
                      opacity: 0.1,
                    }}
                  >
                    {word.text}
                  </Text>
                ))}
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                height: 20,
              }}
            >
              {customData ? (
                <Text className="text-sm">{customData.footerText}</Text>
              ) : account?.completedAudioExercises.includes(id) ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Text className="text-sm">Vježba odrađena:</Text>
                  <MaterialIcons name="verified" size={16} color="#2465e8" />
                </View>
              ) : (
                <Text className="text-sm" style={{ opacity: 0.3 }}>
                  Vježba nije odrađena:
                </Text>
              )}
            </View>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </Link>
  );
}
