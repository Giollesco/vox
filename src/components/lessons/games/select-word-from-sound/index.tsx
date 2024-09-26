import * as React from 'react';

import { Progress } from '@/components/common/progress';
import { useLesson } from '@/stores';
import {
  BaseGame,
  GameState,
  SelectWordFromSound as SelectWordFromSoundType,
} from '@/types';
import { colors, Text, View } from '@/ui';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Speech from 'expo-speech';
import { MotiView } from 'moti';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import SelectOption from '../components/select-option';
import { SelectOptionColor, stepParser } from '../utils';
import { Audio } from 'expo-av';
const soundObject = new Audio.Sound();

type Props = {
  gameState: GameState;
  syncGameState: (newGameState: GameState) => void;
};

export const SelectWordFromSound = ({ gameState, syncGameState }: Props) => {
  // Hooks
  const { width } = useWindowDimensions();
  const { numberOfGames, currentGameIndex, currentGame, setCurrentAnswer } =
    useLesson();

  // Data
  const data = React.useMemo(
    () => currentGame as BaseGame & SelectWordFromSoundType,
    [currentGame]
  );

  // State
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    async function loadSound() {
      let soundSource = require('../../../../../assets/soundFile.mp3');
      // If it wasn't already loaded - load sound
      if (soundObject._loaded === false) {
        await soundObject.loadAsync(soundSource);
      }
    }
    loadSound();
  }, []);

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

  async function speak() {
    if (Platform.OS === 'ios') {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });
      await soundObject.playAsync();
    }
    Speech.speak(data.word, {
      language: 'en',
    });
  }

  return (
    <View className="flex h-full w-full" style={{ overflow: 'hidden' }}>
      {/* Header */}
      <View
        className="flex-column w-full items-center justify-between gap-2"
        style={{ paddingHorizontal: 20, zIndex: 0 }}
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
      <TouchableOpacity onPress={speak} activeOpacity={0.8}>
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          delay={150}
          style={[
            styles.soundWrapper,
            { width: width - 40, marginHorizontal: 20 },
          ]}
        >
          <Ionicons name="volume-medium-outline" size={48} color="black" />
        </MotiView>
      </TouchableOpacity>

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
  soundWrapper: {
    padding: 20,
    paddingBottom: 10,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
