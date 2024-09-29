import { useTimeSpentTracker } from '@/core/hooks/use-time-spent-tracker';
import { colors, Text, View } from '@/ui';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ActivityIndicator, TouchableOpacity } from 'react-native';

export default function TimeSpentTrackerButton() {
  // Hooks
  const { targetReached, timeSpentTodayMinutes, loading } =
    useTimeSpentTracker();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      key={`time-spent-tracker-${timeSpentTodayMinutes}-${targetReached}`}
    >
      <View className="flex-1 items-center justify-center">
        {loading ? (
          <ActivityIndicator />
        ) : (
          <View className="flex-1 items-center justify-center pt-2">
            <View className="flex-row items-center justify-center">
              {targetReached ? (
                <MaterialIcons
                  name="verified"
                  size={18}
                  color={colors.success['500']}
                />
              ) : (
                <MaterialCommunityIcons
                  name="timer-sand"
                  size={18}
                  color="colors.black"
                  style={{ opacity: 0.5 }}
                />
              )}
            </View>
            <Text className="text-center text-sm" style={{ paddingTop: 2 }}>
              {targetReached ? 'Cilj ispunjen' : `${timeSpentTodayMinutes} min`}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
