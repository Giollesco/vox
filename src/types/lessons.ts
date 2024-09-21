export type GameType = 'SelectMissingWord' | 'DescribeImage';

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
  title: string;
  description: string;
  games: Array<Game>;
};
