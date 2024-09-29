import { getWeeksData } from '@/components/analytics/utils';
import { WeeklyChart } from '@/components/analytics/weekly-chart';
import { useAuth } from '@/core';
import { colors, Text, View } from '@/ui';
import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import * as React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedRef,
  useDerivedValue,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {};

export default function Analytics() {
  // Hooks
  const { bottom } = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const { account } = useAuth();

  // Data
  const data = React.useMemo(() => {
    if (!account) return [];
    if (account.dailyGoals.length === 0) return [];
    return getWeeksData(account.dailyGoals);
  }, [account?.dailyGoals]);

  // Refs
  const animatedRef = useAnimatedRef<Animated.ScrollView>();

  // Variables
  const lastIndex = data ? data.length - 1 : 0; // Determine the last week's index (current week)
  const [activeIndexJS, setActiveIndexJS] = React.useState(lastIndex);
  const scrollOffset = useScrollViewOffset(animatedRef);
  const activeIndex = useDerivedValue(() => {
    return Math.floor((scrollOffset.value + windowWidth / 2) / windowWidth);
  }, [scrollOffset]);

  // Reactions
  useAnimatedReaction(
    () => {
      return activeIndex.value;
    },
    (current, previous) => {
      if (current !== previous) {
        runOnJS(setActiveIndexJS)(current);
      }
    }
  );

  React.useEffect(() => {
    setActiveIndexJS(lastIndex);
    scrollOffset.value = lastIndex * windowWidth;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <MotiView
        from={{ opacity: 0, bottom: -10 }}
        animate={{ opacity: 1, bottom: 0 }}
        delay={50}
        style={{ alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        <Text
          weight="regular"
          style={{
            textAlign: 'center',
            width: windowWidth,
            fontSize: 18,
            height: 24,
            color: 'black',
            marginTop: 20,
          }}
        >
          - Trend ispunjenih ciljeva -
        </Text>
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 8,
            backgroundColor: colors.grey.main,
            opacity: 0.5,
          }}
        />
      </MotiView>
      <View style={{ display: data ? 'flex' : 'none' }}>
        <MotiView
          from={{ opacity: 0, bottom: -20 }}
          animate={{ opacity: 1, bottom: 0 }}
          delay={350}
        >
          {data && (
            <WeeklyChart
              width={windowWidth}
              height={160}
              data={data[activeIndexJS]}
            />
          )}
        </MotiView>
        <MotiView
          from={{ opacity: 0, bottom: -20 }}
          animate={{ opacity: 1, bottom: 0 }}
          delay={450}
          style={{
            height: 60,
            width: windowWidth,
          }}
        >
          <Animated.ScrollView
            ref={animatedRef}
            horizontal
            snapToInterval={windowWidth}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            decelerationRate={'fast'}
            // Set initial offset to last week
            contentOffset={{
              x: lastIndex * windowWidth,
              y: 0,
            }}
          >
            {data?.map((week: any, index: number) => {
              const [{ day }] = week;

              return (
                <View
                  key={index}
                  style={[
                    {
                      width: windowWidth,
                    },
                    styles.labelContainer,
                  ]}
                >
                  <Text style={styles.label}>tjedan od {day}</Text>
                </View>
              );
            })}
          </Animated.ScrollView>
        </MotiView>
      </View>
      <MotiView
        from={{ opacity: 0, bottom: -20 }}
        animate={{ opacity: 1, bottom: 0 }}
        delay={400}
        style={{
          display: data ? 'none' : 'flex',
        }}
      >
        <View className="items-center justify-center gap-4">
          <Feather name="bar-chart-2" size={28} color="black" />
          <Text
            className="text-sm text-center w-full"
            style={{ paddingHorizontal: 20 }}
          >
            Ne postoje zapisi o ispunjenim ciljevima
          </Text>
        </View>
      </MotiView>
      <View style={{ height: 24 }} />
      {/* Footer */}
      <MotiView
        from={{ opacity: 0, bottom: -20 }}
        animate={{ opacity: 1, bottom: 0 }}
        delay={500}
        style={{
          width: windowWidth,
          height: bottom + 60,
          position: 'absolute',
          zIndex: 2,
          bottom: 0,
          left: 0,
        }}
      >
        <View style={{ height: bottom + 60 }}>
          <MotiView
            from={{ opacity: 0, bottom: -20 }}
            animate={{ opacity: 1, bottom: 0 }}
            delay={600}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 16,
              paddingHorizontal: 20,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.navigate('/(app)')}
              hitSlop={{ bottom: 12, top: 12, left: 12, right: 12 }}
              style={{ width: 80 }}
            >
              <Ionicons name="arrow-back" size={20} color="black" />
            </TouchableOpacity>
            <Text className="text-center text-xl" weight="semiBold">
              Analitika
            </Text>
            <Text
              className="text-right text-xl"
              weight="bold"
              style={{ width: 80 }}
            >
              {`${data ? account?.dailyGoals.length : 0} / ${
                data ? data.flat().length : 0
              }`}
            </Text>
          </MotiView>
        </View>
      </MotiView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey.light,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listContent: {
    paddingTop: 20,
  },
  labelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    opacity: 0.5,
  },
});
