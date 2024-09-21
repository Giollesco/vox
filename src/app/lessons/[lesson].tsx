import * as React from 'react';

import { GameHandler } from '@/components/lessons';
import { useLesson } from '@/stores';
import { GameState } from '@/types';
import { colors, Text, View } from '@/ui';
import { MOCK_LESSONS } from '@/utils/data';
import { router, useLocalSearchParams } from 'expo-router';
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { showMessage } from 'react-native-flash-message';

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

  // Use useEffect to run the lesson setup only after the component mounts
  React.useEffect(() => {
    if (lesson) {
      const lessonFromList = MOCK_LESSONS.find((l) => l.id === lesson);
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
            gameState.value !== GameState.Idle
              ? withTiming(scaleFactor, { duration })
              : withTiming(1, { duration }),
        },
        {
          translateY:
            gameState.value !== GameState.Idle
              ? withTiming(translateY, { duration })
              : withTiming(0, { duration }),
        },
      ],
    };
  });

  // Functions
  function nextGame() {
    if (lessonStore.currentGameIndex < lessonStore.numberOfGames - 1) {
      if (lessonStore.checkAnswer()) {
        gameState.value = withTiming(GameState.Correct, { duration });
        showMessage({
          message: 'Točan odgovor!',
          description: `${lessonStore.currentAnswer} je točan odgovor.`,
          type: 'success',
          duration: infoDuration,
          icon: 'success',
          position: 'bottom',
        });
        setTimeout(() => {
          gameState.value = withTiming(GameState.Idle, { duration });
          lessonStore.nextGame();
        }, infoDuration);
      } else {
        gameState.value = withTiming(GameState.Incorrect, { duration });
        showMessage({
          message: 'Netočan odgovor!',
          description: `${lessonStore.currentAnswer} nije točan odgovor.`,
          type: 'danger',
          duration: infoDuration,
          icon: 'danger',
          position: 'bottom',
        });
        setTimeout(() => {
          gameState.value = withTiming(GameState.Playing, { duration });
        }, infoDuration);
      }
    } else {
      gameState.value = withTiming(GameState.Idle, { duration }, () => {
        runOnJS(router.push)('/');
        runOnJS(lessonStore.resetState)();
      });
    }
  }

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
          gameState={gameState}
        />
      </Animated.View>

      {/* Underlay elements */}
      <View style={[styles.ctaWrapper, { height: spaceAtBottom }]}>
        <View style={{ padding: 20, paddingTop: 0 }}>
          <TouchableOpacity onPress={nextGame}>
            <Text style={{ color: 'white' }}>Check answer</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    justifyContent: 'flex-start',
    // paddingTop: 20,
    paddingHorizontal: 12,
  },
});

export default Lesson;
