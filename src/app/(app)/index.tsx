import { useLessons } from '@/api';
import { useAudioExercises } from '@/api/audio';
import { AnalyticsDashboardCard } from '@/components/analytics/dashboard-card';
import ExerciseCard from '@/components/audio/gallery-card';
import LogoutButton from '@/components/dashboard/logout-button';
import TimeSpentTrackerButton from '@/components/dashboard/time-spent-tracker-button';
import LessonDashboardCard from '@/components/lessons/dashboard-card';
import { PageLoading } from '@/components/page-loading';
import { useAuth } from '@/core';
import { colors, FocusAwareStatusBar, SafeAreaView, Text, View } from '@/ui';
import { APP_DUMMY_EXERCISE } from '@/utils/data';
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
  const SPACE = 18;
  const BOTTOM = Platform.OS === 'ios' ? bottom : SPACE / 2;
  const FOOTER_HEIGHT = (height - top - BOTTOM - 60) / 3;
  const CONTAINER_WIDTH = width - SPACE;
  const MAIN_CARD_HEIGHT = 280;
  const HEADER_HEIGHT =
    height - FOOTER_HEIGHT - MAIN_CARD_HEIGHT - SPACE * 4 - BOTTOM;

  // Fetching data
  const { data: audioExercises, isLoading: isAudioLoading } =
    useAudioExercises();
  const { isLoading: isLessonsLoading } = useLessons();

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
                <AnalyticsDashboardCard
                  height={
                    FOOTER_HEIGHT -
                    (CONTAINER_WIDTH / 4 - SPACE / 3) -
                    SPACE / 2
                  }
                  width={CONTAINER_WIDTH / 2 - SPACE / 4}
                />
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
                  <TimeSpentTrackerButton />
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
