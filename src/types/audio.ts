export type Word = {
  text: string;
  translation: string;
  partOfSpeech: PartOfSpeech;
  pronunciation: string;
  description: string;
  difficulty: WordDifficulty;
};

export type PartOfSpeech =
  | 'noun'
  | 'pronoun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'preposition'
  | 'conjunction'
  | 'interjection';

export type WordDifficulty = 'easy' | 'medium' | 'hard';

export type AudioExercise = {
  title: string;
  words: Word[];
};
