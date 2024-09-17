import * as React from 'react';

import { colors, Text, View } from '@/ui';
import { REMINDERS } from '@/utils/data';
import { Feather } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

type Props = {
  value: string;
  onSelect: (reminder: string) => void;
  size?: 'small' | 'large';
};

export const ReminderPicker = ({ value, onSelect, size = 'large' }: Props) => {
  // Hooks
  const { width } = useWindowDimensions();

  // Constants
  const ITEM_WIDTH: number = 120;
  const ITEM_HEIGHT: number = size === 'small' ? 52 : 80;
  const VISIBLE_ITEMS: number = 5;
  const CONTAINER_HEIGHT: number = ITEM_HEIGHT * VISIBLE_ITEMS;

  // Variables
  const data = ['', '', ...REMINDERS, '', ''];
  const [selectedItem, setSelectedItem] = React.useState(data.indexOf(value));
  const translationY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    translationY.value = event.contentOffset.y;
  });

  return (
    <View
      className="flex-1"
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        paddingVertical: 20,
      }}
    >
      <View
        className="flex-1 w-full items-center justify-center overflow-hidden"
        style={{
          height: CONTAINER_HEIGHT,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          decelerationRate="fast"
          pagingEnabled
          snapToInterval={ITEM_HEIGHT}
          snapToAlignment="center"
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          {data.map((reminder, index) => {
            const isItemSelected = selectedItem === index;
            return (
              <View
                key={index}
                className="items-center justify-center"
                style={{
                  width: ITEM_WIDTH,
                  height: ITEM_HEIGHT,
                }}
              >
                <Text
                  className="text-2xl"
                  weight="medium"
                  style={{
                    color: isItemSelected ? colors.primary['500'] : '#000',
                    fontSize: size === 'small' ? 28 : 40,
                    lineHeight: size === 'small' ? 50 : 80,
                  }}
                >
                  {reminder}
                </Text>
              </View>
            );
          })}
        </Animated.ScrollView>

        <View
          style={{
            position: 'absolute',
            left: width / 2 - ITEM_WIDTH / 2 - 40,
            top: '46%',
          }}
        >
          <Feather
            name="arrow-right"
            size={32}
            color={colors.primary[500]}
            style={{ marginRight: 10 }}
          />
        </View>
      </View>
    </View>
  );
};
