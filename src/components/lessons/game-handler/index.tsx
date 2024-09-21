import * as React from 'react';

import { GameState, GameType } from '@/types';
import { Text } from '@/ui';
import { SelectMissingWord } from '../games/select-missing-word';
import { SharedValue } from 'react-native-reanimated';

type Props = {
  type: GameType | undefined;
  gameState: SharedValue<GameState>;
};

export const GameHandler = ({ type, gameState }: Props) => {
  if (!type) return null;

  const handler: { [key in GameType]: React.JSX.Element } = {
    SelectMissingWord: <SelectMissingWord gameState={gameState} />,
    DescribeImage: <Text>DescribeImage</Text>,
  };

  return handler[type];
};
