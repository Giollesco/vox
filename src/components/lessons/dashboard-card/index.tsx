import { MotiView } from 'moti';
import React from 'react';
import Animated, { useSharedValue } from 'react-native-reanimated';

import Block from './card/components/block';
import { lessons } from './card/data';

type IProps = {
  height: number;
  width: number;
};

const LessonDashboardCard = ({ height, width }: IProps) => {
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
          lesson={lessons}
          isShowingDetails={isShowingDetails}
          showingStateChanged={onShowingStateChanged}
          height={height}
          width={width}
        />
      </Animated.View>
    </MotiView>
  );
};

export default LessonDashboardCard;
