import React from 'react';
import { StyleSheet } from 'react-native';
import type Animated from 'react-native-reanimated';

import { colors, Text, View } from '@/ui';

interface IProps {
  height: number;
  isShowingDetails: Animated.SharedValue<boolean>;
}

const Content = ({ height, isShowingDetails }: IProps) => {
  return (
    <View style={[styles.container]}>
      {Array.from({ length: 60 }).map((_, index) => (
        <Text key={index} style={{ color: 'white' }}>
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
    backgroundColor: colors.grey.main,
    padding: 20,
  },
});

export default Content;
