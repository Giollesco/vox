import * as React from 'react';

import { colors, View } from '@/ui';

type Props = {
  steps: number;
  currentStep: number;
  accentColor?: string;
  baseColor?: string;
};
export const Progress = ({
  steps,
  currentStep,
  baseColor = '#00000040',
  accentColor = colors.primary['500'],
}: Props) => {
  return (
    <View className="h-4 w-full flex-row align-middle justify-between gap-1 relative">
      {Array.from({ length: steps }).map((_, index) => (
        <View
          key={index}
          style={{
            height: 3,
            width: `${90 / steps}%`,
            backgroundColor: index < currentStep ? accentColor : baseColor,
            borderRadius: 20,
            zIndex: 1,
          }}
        />
      ))}
    </View>
  );
};
