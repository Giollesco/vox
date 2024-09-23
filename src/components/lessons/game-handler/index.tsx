import * as React from 'react';

import { GameState, GameType } from '@/types';
import { DescribeImage } from '../games/describe-image';
import { SelectMissingWord } from '../games/select-missing-word';

type Props = {
  type: GameType | undefined;
  gameState: GameState;
  syncGameState: (newGameState: GameState) => void;
};

const GameHandler = ({ type, gameState, syncGameState }: Props) => {
  if (!type) return null;

  const handler: { [key in GameType]: React.JSX.Element } = {
    SelectMissingWord: (
      <SelectMissingWord gameState={gameState} syncGameState={syncGameState} />
    ),
    DescribeImage: (
      <DescribeImage gameState={gameState} syncGameState={syncGameState} />
    ),
  };

  return handler[type];
};

export default React.memo(GameHandler);
