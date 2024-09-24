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
  { text: '5 minuta', level: Level.L1 },
  { text: '10 minuta', level: Level.L2 },
  { text: '15+ minuta', level: Level.L3 },
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
    title: 'Abeceda',
    description: `U ovoj lekciji ćete naučiti englesku abecedu. Abeceda se sastoji od 26 slova koja se koriste za formiranje riječi u engleskom jeziku. Važno je pravilno izgovarati svako slovo i znati kako se slova kombiniraju u riječi.

## Engleska abeceda:
**A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z**

### Pravila i savjeti:
**Vokali**: A, E, I, O, U
   Ova slova imaju specifičan izgovor i važna su za formiranje riječi.
**Spelovanje** (spelling): Kada nekome želite reći kako se nešto piše, potrebno je izgovoriti svako slovo abecede pojedinačno.
   Primjer: "My name is John, spelled J-O-H-N."

### Vježba:
1. Vježbajte izgovarati svako slovo abecede.
2. Pokušajte spelovati svoje ime i nekoliko riječi koristeći slova abecede.
3. Naučite osnovne fraze za predstavljanje i spelovanje vašeg imena:
   "How do you spell your name?" (Kako se piše tvoje ime?)
   "My name is spelled..." (Moje ime se piše...)
`,
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
  {
    id: '2',
    title: 'Druga lekcija',
    description: `
U ovoj lekciji ćete naučiti kako pravilno koristiti brojeve na engleskom jeziku. Brojevi su ključni dio svakodnevne komunikacije, bilo da se radi o brojanju, izražavanju količine ili govorenju o vremenu i datumima. Naučit ćete osnovne brojeve (one, two, three...), kao i brojeve veće od deset. Također ćemo proći kroz pravila za korištenje rednih brojeva (first, second, third...) te kako ih pravilno izgovoriti i koristiti u različitim situacijama. Ova lekcija će vam pomoći da s lakoćom koristite brojeve u svakodnevnom razgovoru na engleskom jeziku.

## Pravila za korištenje brojeva:

1. **Osnovni brojevi** (cardinal numbers) koriste se za izražavanje količine:
  Primjer: "I have two apples." (Imam dva jabuke.)
   Osnovni brojevi uključuju one, two, three, four...

2. **Redni brojevi** (ordinal numbers) koriste se za izražavanje redoslijeda:
   Primjer: "She finished first in the race." (Završila je prva u utrci.)
   Redni brojevi završavaju na "-st", "-nd", "-rd", ili "-th" ovisno o broju:
     1st (first), 2nd (second), 3rd (third), 4th (fourth)...

3. **Brojevi veći od deset** slijede određeni obrazac:
   11 (eleven), 12 (twelve), 13 (thirteen), 14 (fourteen)...
   Zatim desetice: 20 (twenty), 30 (thirty), 40 (forty), 100 (one hundred), 1000 (one thousand)...

4. **Brojevi u datumu**:
   Redni brojevi se koriste za izražavanje datuma:
     Primjer: "My birthday is on the 15th of March." (Moj rođendan je 15. ožujka.)

5. **Pisanje velikih brojeva**:
   U engleskom jeziku, za brojeve veće od 1000, često se koristi zarez (comma) za odvajanje tisuća:
     1,000 (one thousand), 1,000,000 (one million).
   
6. **Decimalni brojevi**:
   Za decimalne brojeve koristi se točka (dot):
     Primjer: "3.14" (three point one four).


Učenje brojeva je temelj za mnoge druge teme, uključujući vrijeme, cijene i matematiku u svakodnevnoj komunikaciji. Nakon ove lekcije, imat ćete dobru osnovu za korištenje brojeva u raznim situacijama.

`,
    games: [
      {
        title: 'Odaberite riječ koju čujete',
        description:
          'Pritisnite gumb za reprodukciju zvuka i odaberite riječ koju čujete.',
        type: GameType.SelectWordFromSound,
        word: 'Letter',
        options: [
          { value: 'Letter', isCorrect: true },
          { value: 'Sentence', isCorrect: false },
          { value: 'Word', isCorrect: false },
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
  {
    id: '3',
    title: 'Treća lekcija',
    description: `
U ovoj lekciji ćete naučiti kako pravilno koristiti brojeve na engleskom jeziku. Brojevi su ključni dio svakodnevne komunikacije, bilo da se radi o brojanju, izražavanju količine ili govorenju o vremenu i datumima. Naučit ćete osnovne brojeve (one, two, three...), kao i brojeve veće od deset. Također ćemo proći kroz pravila za korištenje rednih brojeva (first, second, third...) te kako ih pravilno izgovoriti i koristiti u različitim situacijama. Ova lekcija će vam pomoći da s lakoćom koristite brojeve u svakodnevnom razgovoru na engleskom jeziku.

## Pravila za korištenje brojeva:

1. **Osnovni brojevi** (cardinal numbers) koriste se za izražavanje količine:
  Primjer: "I have two apples." (Imam dva jabuke.)
   Osnovni brojevi uključuju one, two, three, four...

2. **Redni brojevi** (ordinal numbers) koriste se za izražavanje redoslijeda:
   Primjer: "She finished first in the race." (Završila je prva u utrci.)
   Redni brojevi završavaju na "-st", "-nd", "-rd", ili "-th" ovisno o broju:
     1st (first), 2nd (second), 3rd (third), 4th (fourth)...

3. **Brojevi veći od deset** slijede određeni obrazac:
   11 (eleven), 12 (twelve), 13 (thirteen), 14 (fourteen)...
   Zatim desetice: 20 (twenty), 30 (thirty), 40 (forty), 100 (one hundred), 1000 (one thousand)...

4. **Brojevi u datumu**:
   Redni brojevi se koriste za izražavanje datuma:
     Primjer: "My birthday is on the 15th of March." (Moj rođendan je 15. ožujka.)

5. **Pisanje velikih brojeva**:
   U engleskom jeziku, za brojeve veće od 1000, često se koristi zarez (comma) za odvajanje tisuća:
     1,000 (one thousand), 1,000,000 (one million).
   
6. **Decimalni brojevi**:
   Za decimalne brojeve koristi se točka (dot):
     Primjer: "3.14" (three point one four).


Učenje brojeva je temelj za mnoge druge teme, uključujući vrijeme, cijene i matematiku u svakodnevnoj komunikaciji. Nakon ove lekcije, imat ćete dobru osnovu za korištenje brojeva u raznim situacijama.

`,
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
