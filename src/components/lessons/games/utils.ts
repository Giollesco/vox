import { GameState } from '@/types';
import { colors } from '@/ui';

export const SelectOptionColor: { [key in GameState]: string } = {
  [GameState.Idle]: '#ffffff30',
  [GameState.Playing]: colors.primary[500],
  [GameState.Incorrect]: colors.danger[500],
  [GameState.Correct]: colors.success[500],
};
