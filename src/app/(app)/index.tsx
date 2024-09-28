import { Collection, Database, database, useLessons } from '@/api';
import { useAudioExercises } from '@/api/audio';
import ExerciseCard from '@/components/audio/gallery-card';
import LogoutButton from '@/components/dashboard/logout-button';
import LessonDashboardCard from '@/components/lessons/dashboard-card';
import { PageLoading } from '@/components/page-loading';
import { useAuth } from '@/core';
import { colors, FocusAwareStatusBar, SafeAreaView, Text, View } from '@/ui';
import { APP_DUMMY_EXERCISE, MOCK_LESSONS } from '@/utils/data';
import { ID } from 'appwrite';
import { useLocalSearchParams } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MainScreen() {
  // Hooks
  const auth = useAuth();
  const { width, height } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const audioExerciseGestureActive = useSharedValue(0);
  const { defaultLessonOpen } = useLocalSearchParams<{
    defaultLessonOpen: 'true' | 'false';
  }>();

  // Constants
  const SPACE = 32;
  const BOTTOM = Platform.OS === 'ios' ? bottom : SPACE / 2;
  const FOOTER_HEIGHT = (height - top - BOTTOM - 60) / 3;
  const CONTAINER_WIDTH = width - SPACE;
  const MAIN_CARD_HEIGHT = 280;
  const HEADER_HEIGHT = height - FOOTER_HEIGHT - MAIN_CARD_HEIGHT - SPACE * 4;

  // Fetching data
  const { data: audioExercises, isLoading: isAudioLoading } =
    useAudioExercises();
  const { isLoading: isLessonsLoading } = useLessons();

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // TODO: Remove after writing lessons to Appwrite
  async function writeLessonsToAppwrite() {
    try {
      let lessons = [...MOCK_LESSONS.slice(1)]; // Skip the first lesson

      for (let index = 0; index < lessons.length; index++) {
        let lesson = lessons[index];
        let { id, ...rest } = lesson;
        let collectionId = ID.unique();
        await database.createDocument(
          Database.English,
          Collection.Lessons,
          collectionId,
          {
            ...rest,
            index: index + 1, // Start index from 1
          }
        );
        console.log(`Created document with index: `, index + 1);
        await delay(1000); // Wait for 1 second
      }
    } catch (error) {
      console.error('Error writing lessons to Appwrite: ', error);
    }
  }

  let loading = isAudioLoading || isLessonsLoading;

  return (
    <PageLoading loading={loading}>
      <View
        className="flex-1"
        style={{ backgroundColor: colors.grey.main, alignItems: 'center' }}
      >
        <FocusAwareStatusBar />
        <SafeAreaView
          className="flex-1 items-center py-4"
          style={{ height, width: CONTAINER_WIDTH }}
        >
          {/* Header */}
          <View
            style={{
              zIndex: 10,
              height: HEADER_HEIGHT,
              paddingTop: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View className="flex-column w-full items-center justify-between gap-2">
              <MotiView
                from={{ opacity: 0, bottom: -10 }}
                animate={{ opacity: 1, bottom: 0 }}
                delay={0}
              >
                <Text
                  className="text-md text-center opacity-50"
                  weight="medium"
                >
                  Dobrodošli natrag,
                </Text>
              </MotiView>
              <MotiView
                from={{ opacity: 0, bottom: -10 }}
                animate={{ opacity: 1, bottom: 0 }}
                delay={100}
              >
                <Text className="text-center text-5xl" weight="medium">
                  {`${auth?.account?.firstName} ${auth?.account?.lastName}`}
                </Text>
              </MotiView>
            </View>
          </View>

          <View
            style={{
              height: MAIN_CARD_HEIGHT,
              marginVertical: SPACE / 2,
              zIndex: 300,
            }}
          >
            <LessonDashboardCard
              height={MAIN_CARD_HEIGHT}
              width={CONTAINER_WIDTH}
              defaultOpen={defaultLessonOpen === 'true'}
            />
          </View>

          {/* CTA-s */}
          <View
            className="w-full flex-row items-center justify-between"
            style={{ height: FOOTER_HEIGHT }}
          >
            <MotiView
              from={{ opacity: 0, bottom: -10 }}
              animate={{ opacity: 1, bottom: 0 }}
              delay={300}
            >
              {audioExercises && audioExercises.length > 0 && (
                <ExerciseCard
                  index={-1}
                  cardWidth={CONTAINER_WIDTH / 2 - SPACE / 4}
                  cardHeight={FOOTER_HEIGHT}
                  gestureActive={audioExerciseGestureActive}
                  exercise={APP_DUMMY_EXERCISE}
                  customData={{
                    color: '#FBB1FF',
                    title: 'Audio vježbe',
                    description: 'Vježbajte svoj izgovor',
                    footerText: `Ukupan broj vježbi: ${audioExercises.length}`,
                  }}
                />
              )}
            </MotiView>

            {/* Bottom left */}
            <View
              className="w-full items-center justify-between"
              style={{
                height: FOOTER_HEIGHT,
                width: CONTAINER_WIDTH / 2 - SPACE / 4,
              }}
            >
              {/* Last item */}
              <MotiView
                from={{ opacity: 0, bottom: -10 }}
                animate={{ opacity: 1, bottom: 0 }}
                delay={450}
                className="w-full flex-row items-center justify-between rounded-4xl"
                style={{
                  height:
                    FOOTER_HEIGHT -
                    (CONTAINER_WIDTH / 4 - SPACE / 3) -
                    SPACE / 2,
                  backgroundColor: colors.grey.light,
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text>3</Text>
              </MotiView>

              <View
                className="w-full flex-row items-center justify-between"
                style={{
                  height: CONTAINER_WIDTH / 4 - SPACE / 3,
                  width: '100%',
                }}
              >
                <MotiView
                  from={{ opacity: 0, bottom: -10 }}
                  animate={{ opacity: 1, bottom: 0 }}
                  delay={350}
                  className="w-full flex-row items-center justify-between rounded-4xl"
                  style={{
                    backgroundColor: colors.grey.light,
                    height: '100%',
                    width: CONTAINER_WIDTH / 4 - SPACE / 3,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text>1</Text>
                </MotiView>
                <MotiView
                  from={{ opacity: 0, bottom: -10 }}
                  animate={{ opacity: 1, bottom: 0 }}
                  delay={400}
                  className="w-full flex-row items-center justify-between rounded-4xl"
                  style={{
                    backgroundColor: colors.grey.light,
                    height: '100%',
                    width: CONTAINER_WIDTH / 4 - SPACE / 3,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LogoutButton />
                </MotiView>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </PageLoading>
  );
}
