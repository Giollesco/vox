import * as React from 'react';

import { GameState } from '@/types';
import { colors, FocusAwareStatusBar, Text, View } from '@/ui';
import { useLocalSearchParams } from 'expo-router';
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Progress } from '@/components/common/progress';
import { MOCK_LESSONS } from '@/utils/data';

interface Props {}

const Lesson = ({}: Props) => {
  // Hooks
  const { width, height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const { lesson } = useLocalSearchParams();

  // States
  const [gameState, setGameState] = React.useState<GameState>('idle');
  const uiGameState = useSharedValue<number>(0); // 0: idle, 1: playing
  const duration = 500;
  const currentLesson = React.useMemo(
    () => MOCK_LESSONS.find((l) => l.id === lesson),
    [lesson]
  );

  // Styles
  const animatedWrapperStyle = useAnimatedStyle(() => {
    return {
      borderBottomLeftRadius:
        uiGameState.value === 1
          ? withTiming(32, { duration })
          : withTiming(0, { duration }),
      borderBottomRightRadius:
        uiGameState.value === 1
          ? withTiming(32, { duration })
          : withTiming(0, { duration }),
      transform: [
        {
          scale:
            uiGameState.value === 1
              ? withTiming(0.9, { duration })
              : withDelay(duration, withTiming(1, { duration })),
        },
        {
          translateY:
            uiGameState.value === 1
              ? withDelay(duration, withTiming(-80, { duration }))
              : withTiming(0, { duration }),
        },
      ],
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
        <View className="flex-column w-full items-center justify-between gap-2">
          <Text className="text-md text-center opacity-50" weight="medium">
            Prvi korak
          </Text>
          <Text className="text-center text-5xl" weight="medium">
            {currentLesson?.games[0].title}
          </Text>
          <Progress steps={5} currentStep={1} />
        </View>
        <TouchableOpacity
          style={{ padding: 40, marginTop: 200 }}
          onPress={() => {
            // setGameState((prev) => (prev === 'idle' ? 'playing' : 'idle'));
            uiGameState.value = uiGameState.value === 0 ? 1 : 0;
          }}
        >
          <Text className="text-center">Change state</Text>
        </TouchableOpacity>
      </Animated.View>
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
    padding: 20,
    zIndex: 2,
  },
});

export default Lesson;
