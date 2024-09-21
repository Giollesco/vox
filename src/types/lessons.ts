export enum GameType {
  SelectMissingWord = 'SelectMissingWord',
  DescribeImage = 'DescribeImage',
}

export type GameState = 'idle' | 'playing' | 'correct' | 'incorrect';

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

export type Game = BaseGame &
  Partial<SelectMissingWordGame> &
  Partial<DescribeImageGame>;

export type Lesson = {
  id: string; // TODO: Until we have a real backend, we can use this to identify lessons
  title: string;
  description: string;
  games: Array<Game>;
};
