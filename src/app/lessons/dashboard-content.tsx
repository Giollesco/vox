import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import type Animated from 'react-native-reanimated';
import LessonAccordion from '@/components/lessons/accordion';
import { colors, View } from '@/ui';
import { MOCK_LESSONS } from '@/utils/data';

interface IProps {
  height: number;
  isShowingDetails: Animated.SharedValue<boolean>;
}

const DashboardLessonContent = ({ height, isShowingDetails }: IProps) => {
  // Hooks
  const windowHeight = useWindowDimensions().height;

  return (
    <View style={[styles.container, { minHeight: windowHeight - height }]}>
      {[...MOCK_LESSONS, ...MOCK_LESSONS].map((lesson, index) => (
        <LessonAccordion lesson={lesson} index={index} key={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: colors.grey.light,
  },
  lessonWrapper: {
    borderBottomColor: colors.grey.main,
    borderBottomWidth: 1,
    padding: 20,
  },
  lessonNumber: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.black,
    marginRight: 20,
  },
});

export default React.memo(DashboardLessonContent);
