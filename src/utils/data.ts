import type { AudioExercise } from '@/types';
import { Level } from '@/types';

export const INTERESTS = [
  'Putovanja',
  'Sport',
  'Umjetnost',
  'Tehnologija',
  'Film i televizija',
  'Knjige i čitanje',
  'Glazba',
  'Fotografija',
  'Kućni ljubimci',
];

export const REMINDERS = [
  '00:00h',
  '01:00h',
  '02:00h',
  '03:00h',
  '04:00h',
  '05:00h',
  '06:00h',
  '07:00h',
  '08:00h',
  '09:00h',
  '10:00h',
  '11:00h',
  '12:00h',
  '13:00h',
  '14:00h',
  '15:00h',
  '16:00h',
  '17:00h',
  '18:00h',
  '19:00h',
  '20:00h',
  '21:00h',
  '22:00h',
  '23:00h',
];

export const STARTING_POINTS = [
  { text: 'Potpuni sam početnik', level: Level.L1 },
  { text: 'Mogu voditi jednostavne razgovore', level: Level.L2 },
  { text: 'Govorim sa samopouzdanjem', level: Level.L3 },
];

export const MINUTES_PER_DAY = [
  { text: 'Potpuni sam početnik', level: Level.L1 },
  { text: 'Mogu voditi jednostavne razgovore', level: Level.L2 },
  { text: 'Govorim sa samopouzdanjem', level: Level.L3 },
];

export const DUMMY_EXERCISE: AudioExercise = {
  title: 'DUMMY',
  words: [],
};

export const APP_DUMMY_EXERCISE: AudioExercise = {
  title: 'audio exercise',
  words: [
    {
      text: 'audio exercise',
      translation: 'audio exercise',
      partOfSpeech: 'noun',
      pronunciation: 'audio exercise',
      description: 'audio exercise',
      difficulty: 'easy',
    },
    {
      text: 'audio exercise',
      translation: 'audio exercise',
      partOfSpeech: 'noun',
      pronunciation: 'audio exercise',
      description: 'audio exercise',
      difficulty: 'easy',
    },
    {
      text: 'audio exercise',
      translation: 'audio exercise',
      partOfSpeech: 'noun',
      pronunciation: 'audio exercise',
      description: 'audio exercise',
      difficulty: 'easy',
    },
    {
      text: 'audio exercise',
      translation: 'audio exercise',
      partOfSpeech: 'noun',
      pronunciation: 'audio exercise',
      description: 'audio exercise',
      difficulty: 'easy',
    },
    {
      text: 'audio exercise',
      translation: 'audio exercise',
      partOfSpeech: 'noun',
      pronunciation: 'audio exercise',
      description: 'audio exercise',
      difficulty: 'easy',
    },
    {
      text: 'audio exercise',
      translation: 'audio exercise',
      partOfSpeech: 'noun',
      pronunciation: 'audio exercise',
      description: 'audio exercise',
      difficulty: 'easy',
    },
  ],
};
