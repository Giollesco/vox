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
        title: 'Odaberite slovo koje čujete',
        description:
          'Pritisnite gumb za reprodukciju zvuka i odaberite slovo koje čujete.',
        type: GameType.SelectWordFromSound,
        word: 'a',
        options: [
          { value: 'A', isCorrect: true },
          { value: 'B', isCorrect: false },
          { value: 'C', isCorrect: false },
        ],
      },
      {
        title: 'Odaberite pripadajuće slovo.',
        description: 'Odaberite slovo koje odgovara prikazanoj slici.',
        type: GameType.DescribeImage,
        imageUrl:
          'https://upload.wikimedia.org/wikipedia/commons/8/8d/Cyrillic_letter_A.svg',
        options: [
          { value: 'B', isCorrect: false },
          { value: 'A', isCorrect: true },
          { value: 'C', isCorrect: false },
        ],
      },
      {
        title: 'Odaberite slovo koje nedostaje',
        description: 'Odaberite slovo koje nedostaje u slijedu.',
        type: GameType.SelectMissingWord,
        sentence: 'A, B, C, D, E, _, G, H',
        options: [
          { value: 'F', isCorrect: true },
          { value: 'J', isCorrect: false },
          { value: 'K', isCorrect: false },
        ],
      },
      {
        title: 'Odaberite slovo koje čujete',
        description:
          'Pritisnite gumb za reprodukciju zvuka i odaberite slovo koje čujete.',
        type: GameType.SelectWordFromSound,
        word: 'z',
        options: [
          { value: 'X', isCorrect: false },
          { value: 'Y', isCorrect: false },
          { value: 'Z', isCorrect: true },
        ],
      },
      {
        title: 'Odaberite riječ koja nedostaje',
        description: 'Odaberite slovo koje nedostaje u abecedi.',
        type: GameType.SelectMissingWord,
        sentence: 'W, X, _, Z',
        options: [
          { value: 'Y', isCorrect: true },
          { value: 'V', isCorrect: false },
          { value: 'U', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Brojevi',
    description: `
U ovoj lekciji ćete naučiti kako pravilno koristiti brojeve na engleskom jeziku. Brojevi su važan dio svakodnevne komunikacije i koriste se u mnogim situacijama poput brojenja, izražavanja količine, cijena, datuma i vremena.

## Osnovni brojevi (Cardinal Numbers):
Osnovni brojevi koriste se za izražavanje količine. Upoznat ćemo se s brojevima od 1 do 20, te višim brojevima.

1 - One  
2 - Two  
3 - Three  
4 - Four  
5 - Five  
6 - Six  
7 - Seven  
8 - Eight  
9 - Nine  
10 - Ten  
11 - Eleven  
12 - Twelve  
13 - Thirteen  
14 - Fourteen  
15 - Fifteen  
16 - Sixteen  
17 - Seventeen  
18 - Eighteen  
19 - Nineteen  
20 - Twenty

Brojevi veći od 20 slijede jednostavan obrazac:  
21 - Twenty-one  
30 - Thirty  
40 - Forty  
50 - Fifty  
100 - One hundred  
1,000 - One thousand

## Redni brojevi (Ordinal Numbers):
Redni brojevi koriste se za izražavanje redoslijeda. Uobičajeni redni brojevi su:

1st - First  
2nd - Second  
3rd - Third  
4th - Fourth  
5th - Fifth  
6th - Sixth  
7th - Seventh  
8th - Eighth  
9th - Ninth  
10th - Tenth  
20th - Twentieth  
100th - One hundredth

### Pravila:
**Brojevi veći od deset**: Iznad deset, brojevi se formiraju dodavanjem osnovnih brojeva iza desetica. Primjer: 21 (twenty-one), 45 (forty-five).
**Pisanje datuma**: Redni brojevi se često koriste za izražavanje datuma. Primjer: "March 3rd" (Treći ožujka).
**Pisanje velikih brojeva**: U engleskom jeziku, tisuće i milijuni se često odvajaju zarezom. Primjer: 1,000 (one thousand), 1,000,000 (one million).

## Primjeri upotrebe:
1. **Koliko imate jabuka?** – "I have five apples."
2. **Koji je datum danas?** – "Today is the 15th of July."
3. **Koji je vaš redni broj u utrci?** – "I finished second in the race."

## Vježbe:
1. Prevedite sljedeće brojeve na engleski: 4, 11, 25, 100, 1,000.
2. Napišite redni broj za: 5, 13, 21.
3. Kako biste rekli svoj datum rođenja na engleskom jeziku?

Ova lekcija će vam pomoći da s lakoćom koristite brojeve u svakodnevnim situacijama, od kupovine, pa sve do razgovora o vremenu i datumu.

`,
    games: [
      {
        title: 'Odaberite broj koji čujete',
        description:
          'Pritisnite gumb za reprodukciju zvuka i odaberite broj koji čujete.',
        type: GameType.SelectWordFromSound,
        word: 'Five',
        options: [
          { value: 'Three', isCorrect: false },
          { value: 'Five', isCorrect: true },
          { value: 'Seven', isCorrect: false },
        ],
      },
      {
        title: 'Odaberite pripadajući broj',
        description: 'Odaberite broj koji odgovara slici.',
        type: GameType.DescribeImage,
        imageUrl: 'https://www.pngarts.com/files/3/4-Number-PNG-Image.png',
        options: [
          { value: 'Three', isCorrect: false },
          { value: 'Four', isCorrect: true },
          { value: 'Five', isCorrect: false },
        ],
      },
      {
        title: 'Odaberite broj koji nedostaje',
        description: 'Odaberite broj koji nedostaje u slijedu.',
        type: GameType.SelectMissingWord,
        sentence: 'One, Two, _____, Four, Five',
        options: [
          { value: 'Six', isCorrect: false },
          { value: 'Three', isCorrect: true },
          { value: 'Seven', isCorrect: false },
        ],
      },
      {
        title: 'Odaberite broj koji čujete',
        description:
          'Pritisnite gumb za reprodukciju zvuka i odaberite broj koji čujete.',
        type: GameType.SelectWordFromSound,
        word: 'Nine',
        options: [
          { value: 'Nine', isCorrect: true },
          { value: 'Five', isCorrect: false },
          { value: 'Ten', isCorrect: false },
        ],
      },
      {
        title: 'Odaberite broj koji nedostaje',
        description: 'Odaberite broj koji nedostaje u slijedu.',
        type: GameType.SelectMissingWord,
        sentence: 'Six, Seven, _____, Nine',
        options: [
          { value: 'Eight', isCorrect: true },
          { value: 'Five', isCorrect: false },
          { value: 'Ten', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: '3',
    title: 'Pozdravi i upoznavanje',
    description: `
U ovoj lekciji naučit ćete osnovne fraze za pozdravljanje i upoznavanje na engleskom jeziku. Ove fraze su ključne za započinjanje razgovora i svakodnevnu komunikaciju.

## Osnovni pozdravi (Greetings)
**Hello** – Bok / Zdravo
**Hi** – Bok (neformalno)
**Good morning** – Dobro jutro
**Good afternoon** – Dobar dan
**Good evening** – Dobra večer
**Goodbye** – Doviđenja
**See you later** – Vidimo se kasnije

### Primjeri:
**Hello, how are you?** (Bok, kako si?)
**Good morning!** (Dobro jutro!)
**Goodbye!** (Doviđenja!)

## Upoznavanje (Introductions)
**What's your name?** – Kako se zoveš?
**My name is...** – Zovem se...
**Nice to meet you** – Drago mi je
**Where are you from?** – Odakle si?
**I'm from...** – Ja sam iz...

### Primjeri:
**What's your name?** – "My name is John." (Zovem se John.)
**Nice to meet you!** – "Nice to meet you too!" (I meni je drago.)

## Vježbe:
1. Vježbajte pozdraviti nekoga ujutro: "Good morning!"
2. Pitajte osobu kako se zove i odgovorite: "What's your name?" – "My name is Ana."
3. Naučite koristiti fraze za oproštaj: "Goodbye!" ili "See you later!"
`,
    games: [
      {
        title: 'Odaberite riječ koju čujete',
        description:
          'Pritisnite gumb za reprodukciju zvuka i odaberite riječ koju čujete.',
        type: GameType.SelectWordFromSound,
        word: 'Hello',
        options: [
          { value: 'Hello', isCorrect: true },
          { value: 'Goodbye', isCorrect: false },
          { value: 'Good morning', isCorrect: false },
        ],
      },
      {
        title: 'Odaberite ispravan pozdrav',
        description:
          'Odaberite pozdrav koji odgovara slici (jutro, popodne, večer).',
        type: GameType.DescribeImage,
        imageUrl:
          'https://burst.shopifycdn.com/photos/beach-sun-reflections.jpg?width=1000&format=pjpg&exif=0&iptc=0',
        options: [
          { value: 'Good morning', isCorrect: true },
          { value: 'Good afternoon', isCorrect: false },
          { value: 'Good evening', isCorrect: false },
        ],
      },
      {
        title: 'Odaberite riječ koja nedostaje',
        description: 'Odaberite riječ koja nedostaje u rečenici.',
        type: GameType.SelectMissingWord,
        sentence: 'My name is _____, nice to meet you!',
        options: [
          { value: 'Hello', isCorrect: false },
          { value: 'John', isCorrect: true },
          { value: 'Goodbye', isCorrect: false },
        ],
      },
      {
        title: 'Odaberite rečenicu koju čujete',
        description:
          'Koji je ispravan odgovor na pitanje: "What\'s your name?"',
        type: GameType.SelectWordFromSound,
        word: 'My name is Ana.',
        options: [
          { value: "I'm from Croatia.", isCorrect: false },
          { value: 'My name is Ana.', isCorrect: true },
          { value: 'Goodbye!', isCorrect: false },
        ],
      },
      {
        title: 'Odaberite ispravan pozdrav',
        description:
          'Odaberite pozdrav koji odgovara situaciji: Srećete nekoga po prvi put.',
        type: GameType.SelectMissingWord,
        sentence: 'You meet someone for the first time.',
        options: [
          { value: 'Goodbye', isCorrect: false },
          { value: 'Nice to meet you', isCorrect: true },
          { value: 'See you later', isCorrect: false },
        ],
      },
    ],
  },
];
