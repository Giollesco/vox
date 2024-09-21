import React from 'react';
import { StyleSheet } from 'react-native';
import type Animated from 'react-native-reanimated';

import { colors, Text, View } from '@/ui';

interface IProps {
  height: number;
  isShowingDetails: Animated.SharedValue<boolean>;
}

const DashboardLessonContent = ({ height, isShowingDetails }: IProps) => {
  return (
    <View style={[styles.container]}>
      {Array.from({ length: 60 }).map((_, index) => (
        <Text key={index} style={{ color: 'black' }}>
          Ide gas {index}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: colors.grey.light,
    padding: 20,
  },
});

export default DashboardLessonContent;
