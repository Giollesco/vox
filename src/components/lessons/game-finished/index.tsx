import * as React from 'react';

import { useFinishLesson } from '@/api';
import { useAuth } from '@/core';
import { useLesson } from '@/stores';
import { ActivityIndicator, colors, Text, TouchableOpacity, View } from '@/ui';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import { useWindowDimensions } from 'react-native';

type Props = {};
export const GameFinished = ({}: Props) => {
  // Hooks
  const { width } = useWindowDimensions();
  const { lesson, numberOfWrongAnswers } = useLesson();
  const { account, updateAccount } = useAuth();
  const { mutate: finishLesson, isLoading: isFinishingLesson } =
    useFinishLesson();
  const [canShowBackButton, setCanShowBackButton] =
    React.useState<boolean>(false);

  // Constants
  const baseDelay = 600;

  // Effects
  React.useEffect(() => {
    vibrateOnTextAnimation();
    handleFinishLesson();
  }, []);

  // Functions
  function handleOnFinish() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/');
    }
  }

  function handleFinishLesson() {
    let id = lesson?.$id || '';
    let isLessonAlreadyFinished = account?.completedLessons.includes(id);

    if (account && !isLessonAlreadyFinished) {
      let completedLessons: string[] = [...account.completedLessons, id];

      finishLesson(
        { accountId: account.$id, completedLessons },
        {
          onSuccess(data, variables, context) {
            updateAccount({ completedLessons });
            setTimeout(() => {
              setCanShowBackButton(true);
            }, 1000);
          },
          onError(error, variables, context) {
            console.log('Error on finishing lesson => ', error);
          },
        }
      );
    } else {
      setTimeout(() => {
        setCanShowBackButton(true);
      }, baseDelay + 1000);
    }
  }

  function vibrateOnTextAnimation() {
    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, baseDelay);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, baseDelay + 100);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, baseDelay + 150);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, baseDelay + 175);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, baseDelay + 200);
  }

  return (
    <View className="flex h-full w-full" style={{ overflow: 'hidden' }}>
      {/* Header */}
      <View
        className="flex-column h-full w-full items-center justify-between gap-2"
        style={{ paddingHorizontal: 20, paddingBottom: 120, paddingTop: 60 }}
      >
        <View className="flex-column h-full w-full items-center justify-start gap-2">
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            delay={baseDelay}
          >
            <Text
              className="text-center"
              weight="medium"
              style={{ lineHeight: 50, fontSize: 40 }}
            >
              ⭐
            </Text>
          </MotiView>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            delay={baseDelay + 100}
          >
            <Text
              className="text-center"
              weight="medium"
              style={{
                lineHeight: 50,
                fontSize: 40,
              }}
            >
              Čestitamo!
            </Text>
          </MotiView>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            delay={baseDelay + 150}
            style={{ width: '85%', marginTop: -4 }}
          >
            <Text className="text-center text-xl opacity-50" weight="medium">
              Uspješno ste riješili sve zadatke u lekciji {lesson?.title}
            </Text>
          </MotiView>

          <MotiView
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-around',
              width: '100%',
              marginVertical: 40,
            }}
          >
            <MotiView
              from={{ opacity: 0, bottom: -10 }}
              animate={{ opacity: 1, bottom: 0 }}
              delay={baseDelay + 175}
              style={{ width: 200 }}
            >
              <Text style={{ fontSize: 13, opacity: 0.5, textAlign: 'center' }}>
                Broj riješenih pitanja
              </Text>
              <Text
                weight="semiBold"
                style={{ fontSize: 16, textAlign: 'center' }}
              >
                {lesson?.games.length} pitanja
              </Text>
            </MotiView>
            <MotiView
              from={{ opacity: 0, bottom: -10 }}
              animate={{ opacity: 1, bottom: 0 }}
              delay={baseDelay + 200}
              style={{ width: 200 }}
            >
              <Text style={{ fontSize: 13, opacity: 0.5, textAlign: 'center' }}>
                Broj pogrešnih odgovora
              </Text>
              <Text
                weight="semiBold"
                style={{ fontSize: 16, textAlign: 'center' }}
              >
                {numberOfWrongAnswers} odgovora
              </Text>
            </MotiView>
          </MotiView>
        </View>
        {canShowBackButton && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            delay={baseDelay + 1500}
          >
            <TouchableOpacity
              onPress={handleOnFinish}
              style={{
                padding: 24,
                borderRadius: 18,
              }}
            >
              <View className="flex-row items-center gap-8">
                <Text
                  className="text-center text-xl color-primary-500"
                  weight="medium"
                  style={{ marginTop: -4 }}
                >
                  Natrag na lekcije
                </Text>
                <FontAwesome6
                  name="arrow-right-long"
                  color={colors.primary[500]}
                  size={18}
                />
              </View>
            </TouchableOpacity>
          </MotiView>
        )}

        <View
          style={{
            position: 'absolute',
            bottom: 40,
            width,
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          {isFinishingLesson && <ActivityIndicator />}
        </View>
      </View>
    </View>
  );
};
