import * as React from 'react';

import { colors, Text, TouchableOpacity, View } from '@/ui';
import { MotiView } from 'moti';
import { useLesson } from '@/stores';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { router } from 'expo-router';

type Props = {};
export const GameFinished = ({}: Props) => {
  // Hooks
  const { lesson } = useLesson();

  // Constants
  const baseDelay = 600;

  // Functions
  function handleOnFinish() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/');
    }
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
            <Text className="text-3xl text-center opacity-50" weight="medium">
              ⭐
            </Text>
          </MotiView>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            delay={baseDelay + 100}
          >
            <Text className="text-center text-5xl" weight="medium">
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
                Broj novih riječi
              </Text>
              <Text
                weight="semiBold"
                style={{ fontSize: 16, textAlign: 'center' }}
              >
                {lesson?.games.length} riječi
              </Text>
            </MotiView>
          </MotiView>
        </View>
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
      </View>
    </View>
  );
};
