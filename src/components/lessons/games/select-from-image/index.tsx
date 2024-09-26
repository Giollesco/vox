import * as React from 'react';

import { Progress } from '@/components/common/progress';
import { useLesson } from '@/stores';
import { BaseGame, GameState, SelectFromImageGame } from '@/types';
import { colors, Text, View } from '@/ui';
import { MotiView } from 'moti';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { SelectOptionColor, stepParser } from '../utils';
import ImageSelectOption from '../components/image-select-option';

type Props = {
  gameState: GameState;
  syncGameState: (newGameState: GameState) => void;
};

export const SelectFromImage = ({ gameState, syncGameState }: Props) => {
  // Hooks
  const { width } = useWindowDimensions();
  const { numberOfGames, currentGameIndex, currentGame, setCurrentAnswer } =
    useLesson();

  // Data
  const data = React.useMemo(
    () => currentGame as BaseGame & SelectFromImageGame,
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

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        delay={150}
        style={[
          styles.bubbleWrapper,
          { width: width - 40, marginHorizontal: 20 },
        ]}
      >
        <Text weight="medium" className="text-center text-lg text-white w-full">
          {data.word}
        </Text>
        <View style={styles.bubbleWrapperArrow} />
      </MotiView>

      {/* <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        delay={150}
        style={[styles.imageWrapper, { width: width - 40 }]}
      >
        <Image source={data.imageUrl} style={styles.image} />
      </MotiView> */}

      <View
        className="flex-1"
        style={{
          marginTop: 40,
          paddingHorizontal: 10,
          flexWrap: 'wrap',
          width: '100%',
          flexDirection: 'row',
        }}
      >
        {data.options.map((option, index) => {
          return (
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              delay={150 + index * 50}
              key={index}
              style={styles.imageWrapper}
            >
              <ImageSelectOption
                source={option.value}
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

      <View style={{ marginBottom: 40, alignItems: 'center', marginTop: 20 }}>
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
  imageWrapper: {
    width: '50%',
    height: '50%',
    padding: 3,
  },
  bubbleWrapper: {
    flexDirection: 'row',
    backgroundColor: colors.black,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 20,
    marginTop: 20,
    borderRadius: 24,
  },
  bubbleWrapperArrow: {
    position: 'absolute',
    bottom: -8,
    right: 40,
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: colors.black,
    transform: [{ rotate: '45deg' }],
  },
});
