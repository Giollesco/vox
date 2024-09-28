import * as React from 'react';
import { colors, Text, TouchableOpacity, View } from '@/ui';
import { MotiView } from 'moti';
import Animated from 'react-native-reanimated';
import { Link, router } from 'expo-router';
import * as Haptics from 'expo-haptics';

type Props = {
  width: number;
  height: number;
};

export const analyticsSharedTransitionTag = 'analytics-dashboard-card';

export const AnalyticsDashboardCard = ({ width, height }: Props) => {
  // Define gap and itemWidth based on your needs
  const gap = 10; // Adjust as needed
  const itemWidth = 40; // Width of each MotiView

  // Calculate starting position to center the items
  const startX = (width - (itemWidth * 3 + gap * 2)) / 2;

  return (
    <Animated.View
      sharedTransitionTag={analyticsSharedTransitionTag}
      style={{
        padding: 16,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
      className="rounded-4xl"
    >
      <TouchableOpacity
        onPress={() => {
          router.replace('/analytics');
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
        activeOpacity={0.8}
        style={{ width: '100%', height: '100%', zIndex: 2 }}
      >
        <MotiView
          from={{ opacity: 0, bottom: -10 }}
          animate={{ opacity: 1, bottom: 0 }}
          delay={450}
        >
          <Text className="text-lg" weight="semiBold" numberOfLines={1}>
            Analitika
          </Text>
        </MotiView>
        <MotiView
          from={{ opacity: 0, bottom: -10 }}
          animate={{ opacity: 1, bottom: 0 }}
          delay={550}
        >
          <Text className="text-sm" style={{ marginTop: -4 }}>
            Pregledajte svoje trendove
          </Text>
        </MotiView>
      </TouchableOpacity>

      <MotiView
        from={{ translateY: 100 }}
        animate={{ translateY: 0 }}
        delay={650}
        transition={{ duration: 5000 }}
        style={{
          width: itemWidth,
          height: height,
          borderRadius: 16,
          backgroundColor: colors.black + '0a',
          left: startX, // Centered position
          bottom: -80,
          position: 'absolute',
          zIndex: 0,
        }}
      />
      <MotiView
        from={{ translateY: 100 }}
        animate={{ translateY: 0 }}
        delay={700}
        transition={{ duration: 5000 }}
        style={{
          width: itemWidth,
          height: height,
          borderRadius: 16,
          backgroundColor: colors.black + '0a',
          left: startX + itemWidth + gap, // Centered position with gap
          bottom: -20,
          position: 'absolute',
          zIndex: 0,
        }}
      />
      <MotiView
        from={{ translateY: -100 }}
        animate={{ translateY: 0 }}
        delay={750}
        transition={{ duration: 5000 }}
        style={{
          width: itemWidth,
          height: height,
          borderRadius: 16,
          backgroundColor: colors.black + '0a',
          left: startX + (itemWidth + gap) * 2, // Centered position with gap
          top: -50,
          position: 'absolute',
          zIndex: 0,
        }}
      />
    </Animated.View>
  );
};
