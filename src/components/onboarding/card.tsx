import * as React from 'react';

import { Text, View } from '@/ui';

type Props = {
  language: string;
  word: string;
  color: string;
  backgroundColor: string;
  scale: number;
  showStroke?: boolean;
};
export const OnboardingCard = ({
  language,
  word,
  backgroundColor,
  color,
  scale,
  showStroke = false,
}: Props) => {
  return (
    <View
      style={{
        width: 80,
        height: 80,
        backgroundColor,
        borderRadius: 24,
        paddingLeft: 20,
        justifyContent: 'center',
        transformOrigin: 'center',
        transform: [{ scale }],
      }}
    >
      <Text
        className="opacity-50"
        style={{ color, marginBottom: -10, fontSize: 10 }}
      >
        {language}
      </Text>
      <Text className="text-xl" style={{ color, fontSize: 14 }}>
        {word}
      </Text>

      {showStroke && (
        <View
          style={{
            position: 'absolute',
            top: -4,
            left: -4,
            right: 0,
            bottom: 0,
            borderRadius: 28,
            borderWidth: 1,
            width: 88,
            height: 88,
            borderColor: backgroundColor,
            opacity: 0.35,
          }}
        />
      )}
    </View>
  );
};
