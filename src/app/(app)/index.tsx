import React from 'react';

import { useAudioExercises } from '@/api/audio';
import ExerciseCard from '@/components/audio/gallery-card';
import LessonDashboardCard from '@/components/lessons/dashboard-card';
import { useAuth } from '@/core';
import {
  Button,
  colors,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/ui';
import { APP_DUMMY_EXERCISE } from '@/utils/data';
import { MotiView } from 'moti';
import { useWindowDimensions } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

export default function Feed() {
  // Hooks
  const auth = useAuth();
  const { width, height } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const audioExerciseGestureActive = useSharedValue(0);

  // Constants
  const HEADER_HEIGHT = 180;
  const FOOTER_HEIGHT = (height - top - bottom - 60) / 3;
  const SPACE = 32;
  const CONTAINER_WIDTH = width - SPACE;
  const MAIN_CARD_HEIGHT =
    height - HEADER_HEIGHT - FOOTER_HEIGHT - top - bottom * 1.5 - SPACE;

  // Fetching data
  const { data: audioExercises } = useAudioExercises();

  return (
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
          }}
        >
          <View
            className="flex-row items-center w-full"
            style={{ opacity: 0.35 }}
          >
            <SimpleLineIcons name="logout" size={18} color="black" />
            <Button variant="link" onPress={auth.signOut} label="Sign out" />
          </View>
          <MotiView
            from={{ opacity: 0, bottom: -10 }}
            animate={{ opacity: 1, bottom: 0 }}
          >
            <Text
              weight="light"
              className="text-3xl text-left w-full"
              style={{ width: CONTAINER_WIDTH, opacity: 0.5 }}
            >
              Dobrodošli natrag,
            </Text>
            <Text
              className="text-3xl text-left w-full"
              style={{ width: CONTAINER_WIDTH }}
              weight="semiBold"
            >
              {`${auth?.account?.firstName} ${auth?.account?.lastName}`}
            </Text>
          </MotiView>
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
          />
        </View>

        {/* CTA-s */}
        <View
          className="flex-row items-center justify-between w-full"
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
                  color: colors.primary[500],
                  title: 'Audio vježbe',
                  description: 'Vježbajte svoj izgovor',
                  footerText: `Ukupan broj vježbi: ${audioExercises.length}`,
                }}
              />
            )}
          </MotiView>

          {/* Bottom left */}
          <View
            className="items-center justify-between w-full"
            style={{
              height: FOOTER_HEIGHT,
              width: CONTAINER_WIDTH / 2 - SPACE / 4,
            }}
          >
            <View
              className="flex-row items-center justify-between w-full"
              style={{
                height: CONTAINER_WIDTH / 4 - SPACE / 3,
                width: '100%',
              }}
            >
              <MotiView
                from={{ opacity: 0, bottom: -10 }}
                animate={{ opacity: 1, bottom: 0 }}
                delay={350}
                className="flex-row items-center justify-between w-full rounded-4xl"
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
                className="flex-row items-center justify-between w-full rounded-4xl"
                style={{
                  backgroundColor: colors.grey.light,
                  height: '100%',
                  width: CONTAINER_WIDTH / 4 - SPACE / 3,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text>2</Text>
              </MotiView>
            </View>
            {/* Last item */}
            <MotiView
              from={{ opacity: 0, bottom: -10 }}
              animate={{ opacity: 1, bottom: 0 }}
              delay={450}
              className="flex-row items-center justify-between w-full rounded-4xl"
              style={{
                height:
                  FOOTER_HEIGHT - (CONTAINER_WIDTH / 4 - SPACE / 3) - SPACE / 2,
                backgroundColor: colors.grey.dark,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text>Analytics</Text>
            </MotiView>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
