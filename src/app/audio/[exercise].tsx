import { useFinishExercise } from '@/api/audio';
import AudioExerciseCard from '@/components/audio/exercise-card';
import { RecordButton } from '@/components/audio/exercise-card/record-button';
import { useAuth } from '@/core';
import useWhisper from '@/core/hooks/use-whisper';
import { useAudioExercises } from '@/stores';
import { AudioExercise } from '@/types';
import { Button, colors, FocusAwareStatusBar, Text, View } from '@/ui';
import { SPRING_CONFIG } from '@/utils/config';
import { getContrastColor } from '@/utils/functions';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { MotiView } from 'moti';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AudioListProps {
  exerciseName: string;
  color: string;
  sharedTransitionTag: string;
}

const FOOTER_HEIGHT = 80;

// Success constants
const CONTAINER_ENTER_DURATION = 1000;
const TEXT_ENTER_DURATION = CONTAINER_ENTER_DURATION;

export default function AudioList() {
  // Hooks
  const { account, updateAccount } = useAuth();
  const whisper = useWhisper();
  const { mutate: finishExercise, isLoading: finishingExercise } =
    useFinishExercise();
  const { top, bottom } = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const speechProgress = useSharedValue(0);
  const animatedValue = useSharedValue(0);
  const currentIndex = useSharedValue(0);
  const prevIndex = useSharedValue(0);
  const animatedIsRecording = useSharedValue(0);
  const exerciseFinished = useSharedValue(0);
  const { audioExercises } = useAudioExercises();
  const { exerciseName, color } =
    // @ts-ignore
    useLocalSearchParams<AudioListProps>();
  // State
  const [jsExerciseFinished, setJsExerciseFinished] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [wordIndex, setWordIndex] = useState<number>(0);
  const [recordedText, setRecordedText] = useState<string | undefined>(
    undefined
  );
  const exercise: AudioExercise | undefined = audioExercises.exercises.find(
    (item) => item.title === exerciseName
  );
  const id = useMemo(() => {
    const _exercise = exercise as any;
    return _exercise?.$id;
  }, [exercise]);

  // Functions
  function startProgress() {
    speechProgress.value = withTiming(1, { duration: 500 });
    animatedIsRecording.value = withTiming(1, { duration: 500 });
  }

  function endProgress() {
    speechProgress.value = withTiming(0, { duration: 500 });
  }
  function onExerciseFinish() {
    // Enter finish animation
    setTimeout(() => {
      setJsExerciseFinished(true);
      exerciseFinished.value = withSpring(1, SPRING_CONFIG);
    }, 100);

    // Hide finish animation with callbacks
    setTimeout(() => {
      setJsExerciseFinished(false);
      if (account) {
        let completedAudioExercises: string[] = [
          ...account.completedAudioExercises,
          id,
        ];
        console.log(
          'DEV-LOG ~ setTimeout ~ completedAudioExercises:',
          completedAudioExercises
        );
        finishExercise(
          { accountId: account.$id, completedAudioExercises },
          {
            onSuccess(data, variables, context) {
              updateAccount({ completedAudioExercises });
              exerciseFinished.value = withTiming(
                0,
                { duration: CONTAINER_ENTER_DURATION / 4 },
                () => {
                  runOnJS(router.back)();
                }
              );
            },
            onError(error, variables, context) {
              console.log('ERRROROROR => ', error);
            },
          }
        );
      } else {
        exerciseFinished.value = withTiming(
          0,
          { duration: CONTAINER_ENTER_DURATION / 4 },
          () => {
            runOnJS(router.back)();
          }
        );
      }
    }, 4000);
  }

  function onRecord() {
    setError(undefined);
    if (whisper.isRecording) {
      whisper.stopRecording(
        (transcribedText) => {
          setRecordedText(transcribedText);
          setTimeout(() => {
            endProgress();
          }, 500);
          // Check if the word is correctly pronounced
          if (exercise?.words[wordIndex].text === transcribedText) {
            setTimeout(() => {
              setRecordedText(undefined);
              if (currentIndex.value !== exercise.words.length - 1) {
                animatedIsRecording.value = withTiming(0, { duration: 500 });
                setWordIndex((prev) => prev + 1);
                animatedValue.value = withTiming((currentIndex.value += 1));
                prevIndex.value = currentIndex.value;
              } else {
                onExerciseFinish();
              }
            }, 1000);
          }
        },
        () => {
          setError('Greška prilikom snimanja');
          setRecordedText(undefined);
          endProgress();
        }
      );
      return;
    }
    whisper.startRecording(startProgress, endProgress);
  }

  const animatedSuccessContainerStyle = useAnimatedStyle(() => {
    return {
      top: Math.abs(exerciseFinished.value - 1) * height,
    };
  });

  if (!exercise) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <FocusAwareStatusBar />
        <View style={styles.container}>
          <Text>Exercise not found</Text>
          <Button label="Go back" onPress={() => router.back()} />
        </View>
      </>
    );
  }

  const Cards = useMemo(
    () =>
      exercise.words.map((item, index) => {
        return (
          <AudioExerciseCard
            maxVisibleItems={3}
            item={item}
            index={index}
            dataLength={exercise.words.length}
            animatedValue={animatedValue}
            recordedText={recordedText}
            currentIndex={currentIndex}
            prevIndex={prevIndex}
            speechProgress={speechProgress}
            height={height * 0.7 - FOOTER_HEIGHT}
            width={width - 16}
            whisperLoading={whisper.isLoading}
            error={error}
            gestureEnabled={false}
            key={index}
          />
        );
      }),
    [
      exercise.words,
      animatedValue,
      currentIndex,
      prevIndex,
      speechProgress,
      recordedText,
      error,
      whisper.isLoading,
    ]
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <FocusAwareStatusBar />
      <LinearGradient
        // colors={[color + '44', 'white']}
        colors={[colors.grey.main, 'white']}
        style={styles.container}
      >
        <View style={{ height: height * 0.35 - FOOTER_HEIGHT }} />
        <View
          style={{
            position: 'absolute',
            top: top + 20,
            // left: 20,
            flexDirection: 'column',
            height: height * 0.35 - FOOTER_HEIGHT,
          }}
        >
          <View
            style={{
              flexDirection: 'column',
              height: 48,
            }}
          >
            <MotiView
              from={{ opacity: 0, bottom: -10 }}
              animate={{ opacity: 1, bottom: 0 }}
              delay={50}
            >
              <Text
                weight="regular"
                style={{
                  textAlign: 'center',
                  width: width,
                  fontSize: 20,
                  height: 24,
                  color: 'black',
                }}
              >
                {`- ${exercise.title} -`}
              </Text>
            </MotiView>
            {!whisper.isModelLoaded && (
              <TouchableOpacity
                onPress={whisper.loadModel}
                hitSlop={{ bottom: 20, left: 20, right: 20, top: 20 }}
              >
                <Text
                  weight="regular"
                  style={{
                    textAlign: 'center',
                    width: width,
                    fontSize: 11,
                    paddingHorizontal: 20,
                    color: 'black',
                    opacity: 0.5,
                  }}
                >
                  {whisper.error}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <MotiView
          from={{ opacity: 0, bottom: -20 }}
          animate={{ opacity: 1, bottom: 0 }}
          style={{ width, height: height * 0.65 - FOOTER_HEIGHT }}
        >
          {Cards}
        </MotiView>
        <View style={[styles.footer, { paddingBottom: bottom }]}>
          <MotiView
            from={{ opacity: 0, bottom: -10 }}
            animate={{ opacity: 1, bottom: 0 }}
            delay={300}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.back()}
              hitSlop={{ bottom: 12, top: 12, left: 12, right: 12 }}
              style={{ width: 40 }}
            >
              <Ionicons name="arrow-back" size={20} color="black" />
            </TouchableOpacity>
          </MotiView>
          <MotiView
            key="record-button"
            from={{ opacity: 0, bottom: -20 }}
            animate={{ opacity: 1, bottom: 0 }}
            delay={400}
          >
            <RecordButton
              isRecording={whisper.isRecording}
              progress={animatedIsRecording}
              isWordCorrect={
                exercise.words[wordIndex].text === whisper.slugText
              }
              onPress={onRecord}
            />
          </MotiView>
          <MotiView
            from={{ opacity: 0, bottom: -10 }}
            animate={{ opacity: 1, bottom: 0 }}
            delay={300}
          >
            <Text weight="bold">{`${wordIndex + 1} / ${
              exercise.words.length
            }`}</Text>
          </MotiView>
        </View>
      </LinearGradient>
      {jsExerciseFinished && (
        <Animated.View
          style={[
            styles.successContainer,
            {
              backgroundColor: color,
              height,
              width,
              zIndex: 100,
            },
            animatedSuccessContainerStyle,
          ]}
        >
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Animated.View
              key={`star-${exerciseFinished.value === 1 ? 'show' : 'hide'}`}
              entering={FadeIn.delay(TEXT_ENTER_DURATION)}
              exiting={FadeOut}
            >
              <Text
                weight="bold"
                className="text-5xl"
                style={{ color: getContrastColor(color), lineHeight: 60 }}
              >
                ⭐
              </Text>
            </Animated.View>
            <Animated.View
              key={`congrats-${exerciseFinished.value === 1 ? 'show' : 'hide'}`}
              entering={FadeIn.delay(TEXT_ENTER_DURATION + 50)}
              exiting={FadeOut}
            >
              <Text
                weight="bold"
                className="text-5xl"
                style={{ color: getContrastColor(color), lineHeight: 60 }}
              >
                Čestitamo!
              </Text>
            </Animated.View>
            <Animated.View
              key={`message-${exerciseFinished.value === 1 ? 'show' : 'hide'}`}
              entering={FadeIn.delay(TEXT_ENTER_DURATION + 100)}
              exiting={FadeOut}
            >
              <Text
                weight="medium"
                style={{
                  fontSize: 18,
                  color: getContrastColor(color),
                  paddingHorizontal: 40,
                  textAlign: 'center',
                }}
              >
                Uspješno ste završili vježbu {exercise.title}
              </Text>
            </Animated.View>
            {finishingExercise && <ActivityIndicator />}
          </View>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 4,
    paddingTop: 60,
  },
  button: {
    backgroundColor: '#333',
    borderRadius: 24,
    height: 80,
    width: 80,
    transform: [{ translateY: -20 }],
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  footer: {
    height: FOOTER_HEIGHT,
    paddingBottom: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  successContainer: {
    flex: 1,
    position: 'absolute',
    left: 0,
  },
});
