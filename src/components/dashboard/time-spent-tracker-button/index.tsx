import { useTimeSpentTracker } from '@/core/hooks/use-time-spent-tracker';
import { colors, Text, View } from '@/ui';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function TimeSpentTrackerButton() {
  // Hooks
  const { targetReached, timeSpentTodayMinutes, resetTimeSpent } =
    useTimeSpentTracker();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{ opacity: 0.5 }}
      onPress={resetTimeSpent}
      key={`time-spent-tracker-${timeSpentTodayMinutes}`}
    >
      <View className="flex-1 items-center justify-center pt-2">
        <View className="flex-row items-center justify-center">
          <MaterialCommunityIcons
            name={targetReached ? 'timer-sand-full' : 'timer-sand'}
            size={18}
            color={targetReached ? colors.success[500] : colors.black}
          />
        </View>
        <Text className="text-center" style={{ fontSize: 10 }}>
          {targetReached ? 'Cilj ispunjen!' : `${timeSpentTodayMinutes} min`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
