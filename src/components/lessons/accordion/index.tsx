import { Lesson } from '@/types';
import { colors, Text, View } from '@/ui';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Markdown, { hasParents } from '@ronradtke/react-native-markdown-display';
import { Link } from 'expo-router';
import React, { FC, PropsWithChildren } from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { rules } from './rules';
import { useAuth } from '@/core';

type Props = {
  lesson: Lesson;
  index: number;
};

const LessonAccordion: FC<Props> = ({ lesson, index }) => {
  // Hooks
  const { width } = useWindowDimensions();
  const { account } = useAuth();

  // Variables
  const open = useSharedValue(false);
  let lessonFinished = account?.completedLessons.includes(lesson.$id);
  let nextLessonToFinish = account?.completedLessons.length || 0;
  let lessonDisabled = index > nextLessonToFinish;

  // Functions
  const onPress = () => {
    open.value = !open.value;
  };

  return (
    <View style={[styles.container, { width }]}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
          <View className="flex-row items-center">
            <View
              style={[
                styles.lessonNumber,
                {
                  backgroundColor: lessonFinished
                    ? colors.success[500]
                    : colors.grey.main,
                },
              ]}
            >
              <Text weight="bold">{index + 1}</Text>
            </View>
            <Text weight="bold" className="text-2xl" style={{ height: 32 }}>
              {lesson.title}
            </Text>
          </View>
        </TouchableOpacity>
        <Link
          key={index}
          href={{
            pathname: '/lessons/[lesson]',
            params: { lesson: lesson.$id },
          }}
          asChild
          disabled={lessonDisabled}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={lessonDisabled}
            style={{
              opacity: lessonDisabled ? 0.15 : 1,
              padding: 20,
              marginRight: -20,
            }}
          >
            <FontAwesome6
              name={lessonFinished ? 'check' : 'arrow-right-long'}
              color={lessonFinished ? colors.success[500] : colors.black}
              size={22}
            />
          </TouchableOpacity>
        </Link>
      </View>
      <Parent open={open} index={index}>
        <Markdown rules={rules}>{lesson.description}</Markdown>
        <View style={{ height: 20 }} />
      </Parent>
    </View>
  );
};

export default React.memo(LessonAccordion);

type ParentProps = PropsWithChildren<{
  open: SharedValue<boolean>;
  index: number;
}>;

function Parent({ open, index, children }: ParentProps) {
  return (
    <View style={styles.parent}>
      <AccordionItem isExpanded={open} viewKey={`accordion_${index}`}>
        {children}
      </AccordionItem>
    </View>
  );
}

type AccordionItemProps = {
  isExpanded: SharedValue<boolean>;
  children: React.ReactNode;
  viewKey: string;
  style?: any;
  duration?: number;
};

function AccordionItem({
  isExpanded,
  children,
  viewKey,
  style,
  duration = 750,
}: AccordionItemProps) {
  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded.value), {
      duration,
    })
  );
  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  return (
    <Animated.View
      key={`accordionItem_${viewKey}`}
      style={[styles.animatedView, bodyStyle, style]}
    >
      <View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={styles.wrapper}
      >
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: colors.grey.main,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 80,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  lessonNumber: {
    width: 40,
    height: 40,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  parent: {
    width: '100%',
    paddingHorizontal: 20,
  },
  wrapper: {
    width: '100%',
    position: 'absolute',
    // display: 'flex',
    // alignItems: 'center',
  },
  animatedView: {
    width: '100%',
    overflow: 'hidden',
  },
});
