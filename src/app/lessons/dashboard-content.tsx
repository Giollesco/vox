import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import type Animated from 'react-native-reanimated';

import { colors, Text, View } from '@/ui';
import { MOCK_LESSONS } from '@/utils/data';
import { Link } from 'expo-router';

interface IProps {
  height: number;
  isShowingDetails: Animated.SharedValue<boolean>;
}

const DashboardLessonContent = ({ height, isShowingDetails }: IProps) => {
  // Hooks
  const windowHeight = useWindowDimensions().height;

  // Functions
  function handleNavigateToLesson(lesson: string) {
    console.log(lesson);
  }

  console.log('RENDERED');

  return (
    <View style={[styles.container, { minHeight: windowHeight - height }]}>
      {MOCK_LESSONS.map((lesson, index) => (
        <Link
          key={index}
          href={{
            pathname: '/lessons/[lesson]',
            params: { lesson: lesson.id },
          }}
          asChild
        >
          <TouchableOpacity
            style={{ marginBottom: 20 }}
            activeOpacity={0.4}
            onPress={() => handleNavigateToLesson(lesson.id)}
          >
            <View
              className="flex-row items-center"
              style={styles.lessonWrapper}
            >
              <View style={styles.lessonNumber}>
                <Text>{index + 1}</Text>
              </View>
              <View>
                <Text weight="bold" className="text-3xl">
                  {lesson.title}
                </Text>
                <Text>{lesson.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Link>
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
