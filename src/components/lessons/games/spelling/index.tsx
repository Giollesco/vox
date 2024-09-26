import * as React from 'react';

import { Progress } from '@/components/common/progress';
import { useLesson } from '@/stores';
import { BaseGame, GameState, SpellingGame } from '@/types';
import { colors, Text, View } from '@/ui';
import { MotiView } from 'moti';
import { StyleSheet } from 'react-native';
import SelectOption from '../select-option';
import { SelectOptionColor, stepParser } from '../utils';

type Props = {
  gameState: GameState;
  syncGameState: (newGameState: GameState) => void;
};

export const Spelling = ({ gameState, syncGameState }: Props) => {
  // Hooks
  const { numberOfGames, currentGameIndex, currentGame, setCurrentAnswer } =
    useLesson();

  // Data
  const data = React.useMemo(
    () => currentGame as BaseGame & SpellingGame,
    [currentGame]
  );

  // State
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null
  );

  // Functions
  function onSelect(value: string) {
    let newOption = selectedOption === value ? null : value;
    setSelectedOption(newOption);
    setCurrentAnswer(newOption);
    if (newOption) {
      syncGameState(GameState.Playing);
    } else {
      syncGameState(GameState.Idle);
    }
  }

  return (
    <View className="flex h-full w-full" style={{ overflow: 'hidden' }}>
      {/* Header */}
      <View
        className="flex-column w-full items-center justify-between gap-2"
        style={{ paddingHorizontal: 20 }}
      >
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          delay={0}
        >
          <Text className="text-md text-center opacity-50" weight="medium">
            {stepParser[currentGameIndex]}
          </Text>
        </MotiView>
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          delay={100}
        >
          <Text className="text-center text-5xl" weight="medium">
            {data.title}
          </Text>
        </MotiView>
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          delay={150}
          style={{ width: '65%', marginTop: 8 }}
        >
          <Progress steps={numberOfGames} currentStep={currentGameIndex + 1} />
        </MotiView>
      </View>

      <View className="flex-row items-center justify-evenly">
        {data.options.map((option, index) => (
          <MotiView
            key={index}
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            delay={150 + index * 25}
            style={[styles.bubbleWrapper, { width: '28%' }]}
          >
            <Text
              weight="medium"
              className="text-center text-lg text-white w-full"
            >
              {option.value}
            </Text>
            <View style={[styles.bubbleWrapperArrow]} />
          </MotiView>
        ))}
      </View>

      <View
        className="flex-1"
        style={{ marginTop: 40, paddingHorizontal: 10, gap: 3 }}
      >
        {data.options.map((option, index) => {
          return (
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              delay={150 + index * 50}
              key={index}
            >
              <SelectOption
                text={option.value}
                activeBackgroundColor={
                  selectedOption === option.value
                    ? SelectOptionColor[gameState]
                    : SelectOptionColor[GameState.Idle]
                }
                selected={selectedOption === option.value}
                onSelect={() => onSelect(option.value)}
                gameState={gameState}
              />
            </MotiView>
          );
        })}
      </View>

      <View style={{ marginBottom: 40, alignItems: 'center' }}>
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          delay={250}
        >
          <Text
            weight="semiBold"
            className="text-center text-primary-500"
            style={{ color: colors.primary[500] }}
          >
            Napomena
          </Text>
        </MotiView>
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          delay={300}
          style={{ width: '80%' }}
        >
          <Text weight="light" className="text-center">
            {data.description}
          </Text>
        </MotiView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bubbleWrapper: {
    flexDirection: 'row',
    backgroundColor: colors.black,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 20,
    borderRadius: 24,
  },
  bubbleWrapperArrow: {
    position: 'absolute',
    bottom: -8,
    right: 28,
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: colors.black,
    transform: [{ rotate: '45deg' }],
  },
});
