import { Models } from 'appwrite';

export enum GameType {
  SelectMissingWord = 'SelectMissingWord',
  DescribeImage = 'DescribeImage',
  SelectWordFromSound = 'SelectWordFromSound',
  Spelling = 'Spelling',
  SelectFromImage = 'SelectFromImage',
}
export enum GameState {
  Idle = 0,
  Playing = 1,
  Incorrect = 2,
  Correct = 3,
  Finished = 4,
}

export type GameOption = {
  value: string;
  isCorrect: boolean;
};

export type BaseGame = {
  title: string;
  description: string;
  type: GameType;
};

export type SelectMissingWordGame = {
  sentence: string;
  options: Array<GameOption>;
};

export type DescribeImageGame = {
  imageUrl: string;
  options: Array<GameOption>;
};

export type SelectWordFromSound = {
  word: string;
  options: Array<GameOption>;
};

export type SpellingGame = {
  options: Array<GameOption>;
};

export type SelectFromImageGame = {
  word: string;
  options: Array<GameOption>;
};

export type Game = BaseGame &
  Partial<SelectMissingWordGame> &
  Partial<DescribeImageGame> &
  Partial<SelectWordFromSound> &
  Partial<SpellingGame> &
  Partial<SelectFromImageGame>;

export type Lesson = Models.Document & {
  index: number;
  title: string;
  description: string;
  games: Array<Game>;
};
