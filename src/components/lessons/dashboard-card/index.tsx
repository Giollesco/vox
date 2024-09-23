import { MotiView } from 'moti';
import React, { useEffect } from 'react';
import Animated, { useSharedValue } from 'react-native-reanimated';

import Block from './card/components/block';

type IProps = {
  height: number;
  width: number;
  defaultOpen?: boolean;
};

const LessonDashboardCard = ({
  height,
  width,
  defaultOpen = false,
}: IProps) => {
  // Variables
  const isShowingDetails = useSharedValue(false);

  // Methods
  const onShowingStateChanged = () => {
    'worklet';
    isShowingDetails.value = !isShowingDetails.value;
  };

  return (
    <MotiView
      from={{ opacity: 0, bottom: -10 }}
      animate={{ opacity: 1, bottom: 0 }}
      delay={200}
      style={[{ zIndex: 300 }]}
    >
      <Animated.View style={[{ zIndex: 300, width }]}>
        {/* Cards */}
        <Block
          isShowingDetails={isShowingDetails}
          showingStateChanged={onShowingStateChanged}
          height={height}
          width={width}
          defaultOpen={defaultOpen}
        />
      </Animated.View>
    </MotiView>
  );
};

export default LessonDashboardCard;
