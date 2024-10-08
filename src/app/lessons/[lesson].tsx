import * as React from 'react';

import { useLessons } from '@/api';
import GameHandler from '@/components/lessons/game-handler';
import { useLesson } from '@/stores';
import { GameState } from '@/types';
import { colors, Text, View } from '@/ui';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Canvas, LinearGradient, Rect, vec } from '@shopify/react-native-skia';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams } from 'expo-router';
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {}

const Lesson = ({}: Props) => {
  // Hooks
  const { width, height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const { lesson } = useLocalSearchParams();
  const lessonStore = useLesson();

  // Constants
  const duration = 350;
  const infoDuration = 2000;
  const scaleFactor = 0.95;
  const translateY = -120;
  const scaledHeight = height * scaleFactor;
  const spaceAtBottom = height - scaledHeight + Math.abs(translateY) / 2;

  // States
  const gameState = useSharedValue<GameState>(GameState.Idle);
  const [jsGameState, setJsGameState] = React.useState<GameState>(
    GameState.Idle
  );

  // Functions
  function syncGameState(newGameState: GameState) {
    setJsGameState(newGameState);
    gameState.value = withTiming(newGameState, { duration });
  }

  // Use useEffect to run the lesson setup only after the component mounts
  React.useEffect(() => {
    lessonStore.resetState();
    if (lesson && lessonStore.lessons) {
      const lessonFromList = lessonStore.lessons.find((l) => l.$id === lesson);
      if (lessonFromList) {
        lessonStore.initialSetup(lessonFromList);
      }
    }
  }, [lesson]);

  // Styles
  const animatedWrapperStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale:
            gameState.value !== GameState.Idle &&
            gameState.value !== GameState.Finished
              ? withTiming(scaleFactor, { duration })
              : withTiming(1, { duration }),
        },
        {
          translateY:
            gameState.value !== GameState.Idle &&
            gameState.value !== GameState.Finished
              ? withTiming(translateY, { duration })
              : withTiming(0, { duration }),
        },
      ],
    };
  });

  // Functions
  function nextGame() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // If answer is correct and it's not the last game
    if (
      lessonStore.checkAnswer() &&
      lessonStore.currentGameIndex < lessonStore.numberOfGames - 1
    ) {
      // Show correct state
      syncGameState(GameState.Correct);
      // Wait for infoDuration and then show idle state
      setTimeout(() => {
        syncGameState(GameState.Idle);
      }, infoDuration - duration * 1.75);
      setTimeout(() => {
        // Go to next game
        lessonStore.nextGame();
      }, infoDuration);
    } else if (!lessonStore.checkAnswer()) {
      // If answer is incorrect
      // Show incorrect state
      syncGameState(GameState.Incorrect);
      lessonStore.setNumberOfWrongAnswers(lessonStore.numberOfWrongAnswers + 1);
      // Wait for infoDuration and then show playing state
      setTimeout(() => {
        syncGameState(GameState.Playing);
      }, infoDuration);
    } else {
      // If it's the last game
      if (lessonStore.checkAnswer()) {
        syncGameState(GameState.Correct);
      } else {
        syncGameState(GameState.Incorrect);
        lessonStore.setNumberOfWrongAnswers(
          lessonStore.numberOfWrongAnswers + 1
        );
      }
      setTimeout(() => {
        syncGameState(GameState.Finished);
      }, duration * 2);
    }
  }

  const animatedGradientStyle = useAnimatedStyle(() => {
    return {
      height:
        gameState.value !== GameState.Idle &&
        gameState.value !== GameState.Finished
          ? 300
          : 180,
      opacity:
        gameState.value !== GameState.Idle &&
        gameState.value !== GameState.Finished
          ? withTiming(1, { duration })
          : withTiming(0, { duration }),
    };
  });

  return (
    <View style={[styles.container, { width, height }]}>
      <Animated.View
        style={[
          styles.wrapper,
          { paddingTop: top + 20, width, height },
          animatedWrapperStyle,
        ]}
      >
        <GameHandler
          type={lessonStore.currentGame?.type}
          gameState={jsGameState}
          syncGameState={syncGameState}
        />

        <Animated.View
          style={[styles.gradientWrapper, { width }, animatedGradientStyle]}
        >
          <Canvas style={{ flex: 1 }}>
            <Rect
              x={0}
              y={Math.abs(translateY) - top}
              width={width}
              height={300}
            >
              <LinearGradient
                start={vec(0, 0)}
                end={vec(0, 300)}
                colors={[
                  colors.grey.main,
                  colors.grey.main + 'f1',
                  colors.grey.main + '00',
                ]}
              />
            </Rect>
          </Canvas>
        </Animated.View>
      </Animated.View>

      {/* Underlay elements */}
      <TouchableOpacity
        onPress={nextGame}
        style={[styles.ctaWrapper, { height: spaceAtBottom }]}
      >
        <View
          style={{
            padding: 20,
            paddingTop: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white' }}>
            {jsGameState === GameState.Playing
              ? 'Provjerite odgovor'
              : jsGameState === GameState.Correct
              ? 'Sljedeće pitanje slijedi...'
              : jsGameState === GameState.Incorrect
              ? 'Pokušajte ponovno'
              : ''}
          </Text>
          {jsGameState !== GameState.Idle && (
            <FontAwesome6 name="arrow-right-long" size={18} color="white" />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.black,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  wrapper: {
    backgroundColor: colors.grey.main,
    paddingVertical: 20,
    zIndex: 2,
    borderRadius: 32,
  },
  ctaWrapper: {
    zIndex: 1,
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    width: '100%',
    justifyContent: 'flex-start',
    paddingTop: 32,
    paddingHorizontal: 12,
  },
  gradientWrapper: {
    width: '100%',
    height: 300,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
});

export default React.memo(Lesson);
