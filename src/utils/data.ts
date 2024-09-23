import type { AudioExercise, Lesson } from '@/types';
import { GameType, Level } from '@/types';

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

export const MOCK_LESSONS: Array<Lesson> = [
  {
    id: '1',
    title: 'Brojevi',
    description: 'U ovoj lekciji ćemo naučiti brojeve od 1 do 10.',
    games: [
      {
        title: 'Odaberite riječ koja nedostaje',
        description: 'Odaberite riječ koja nedostaje u rečenici.',
        type: GameType.SelectMissingWord,
        sentence: 'One, Two, Three, Four, ____,',
        options: [
          { value: 'Five', isCorrect: true },
          { value: 'Six', isCorrect: false },
          { value: 'Seven', isCorrect: false },
        ],
      },
      {
        title: 'Odaberite pripadajuću riječ.',
        description: 'Odaberite broj koji predstavlja riješenje.',
        type: GameType.DescribeImage,
        imageUrl:
          'https://media.baamboozle.com/uploads/images/225057/1637130308_50234.jpeg',
        options: [
          { value: 'Three', isCorrect: false },
          { value: 'Four', isCorrect: true },
          { value: 'Five', isCorrect: false },
        ],
      },
      {
        title: 'Odaberite riječ koja nedostaje',
        description: 'Odaberite riječ koja nedostaje u rečenici.',
        type: GameType.SelectMissingWord,
        sentence: 'One, Two, _____, Four, Five,',
        options: [
          { value: 'Eleven', isCorrect: false },
          { value: 'Six', isCorrect: false },
          { value: 'Three', isCorrect: true },
        ],
      },
    ],
  },
];
