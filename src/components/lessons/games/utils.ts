import { GameState } from '@/types';
import { colors } from '@/ui';

export const SelectOptionColor: { [key in GameState]: string } = {
  [GameState.Idle]: '#ffffff30',
  [GameState.Playing]: colors.primary[500],
  [GameState.Incorrect]: colors.danger[500],
  [GameState.Correct]: colors.success[500],
};

export const stepParser: { [key: number]: string } = {
  0: 'Prvi korak',
  1: 'Drugi korak',
  2: 'Treći korak',
  3: 'Četvrti korak',
  4: 'Peti korak',
  5: 'Šesti korak',
  6: 'Sedmi korak',
  7: 'Osmi korak',
  8: 'Deveti korak',
  9: 'Deseti korak',
};
