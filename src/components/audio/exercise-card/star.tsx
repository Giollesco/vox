import * as React from 'react';

import { WordDifficulty } from '@/types';
import { colors, View } from '@/ui';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type Props = {
  difficulty: WordDifficulty;
};
export const ExerciseCardStar = ({ difficulty }: Props) => {
  // Maps
  const name: { [difficulty in WordDifficulty]: string } = {
    easy: 'star-o',
    medium: 'star-half-full',
    hard: 'star',
  };

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.black,
        borderRadius: 40,
        padding: 8,
        opacity: 0.3,
      }}
    >
      <FontAwesome name={name[difficulty] as any} size={18} color="black" />
    </View>
  );
};
