import { create } from 'zustand';

import { createSelectors } from '@/core/utils';
import {
  BaseGame,
  Game,
  GameType,
  Lesson,
  SelectMissingWordGame,
} from '@/types';

export type LessonStore = {
  renderFlag: boolean;
  numberOfGames: number;
  setNumberOfGames: (numberOfGames: number) => void;
  lesson: Lesson | null;
  setLesson: (lesson: Lesson) => void;
  currentGame: Game | null;
  setCurrentGame: (game: Game) => void;
  currentGameIndex: number;
  setCurrentGameIndex: (index: number) => void;
  initialSetup: (lesson: Lesson) => void;
  nextGame: () => void;
  resetState: () => void;
  currentAnswer: any;
  setCurrentAnswer: (answer: any) => void;
  checkAnswer: () => boolean;
  numberOfWrongAnswers: number;
  setNumberOfWrongAnswers: (number: number) => void;
};

const _useLesson = create<LessonStore>((set, get) => ({
  renderFlag: false,
  numberOfGames: 0,
  setNumberOfGames: (numberOfGames) => set({ numberOfGames }),
  lesson: null,
  setLesson: (lesson) => set({ lesson }),
  currentGame: null,
  setCurrentGame: (game) => set({ currentGame: game }),
  currentGameIndex: 0,
  setCurrentGameIndex: (index) => set({ currentGameIndex: index }),
  initialSetup: (lesson) => {
    set({ lesson });
    set({ numberOfGames: lesson.games.length });
    set({ currentGame: lesson.games[0] });
    set({ currentGameIndex: 0 });
  },
  nextGame: () => {
    const { currentGameIndex, numberOfGames, lesson } = get();
    if (currentGameIndex < numberOfGames - 1) {
      set({ currentGameIndex: currentGameIndex + 1 });
      set({ currentGame: lesson?.games[currentGameIndex + 1] });
      set({ currentAnswer: null });
    }
  },
  resetState: () => {
    set({ numberOfGames: 0 });
    set({ lesson: null });
    set({ currentGame: null });
    set({ currentGameIndex: 0 });
    set({ renderFlag: !get().renderFlag });
    set({ currentAnswer: null });
    set({ numberOfWrongAnswers: 0 });
  },
  currentAnswer: null,
  setCurrentAnswer: (answer) => set({ currentAnswer: answer }),
  checkAnswer: () => {
    const { currentGame, currentAnswer } = get();
    if (!currentGame) return false;
    let game = currentGame as BaseGame & SelectMissingWordGame;
    const correctAnswer = game.options.find((o) => o.isCorrect)?.value;
    return correctAnswer === currentAnswer;
  },
  numberOfWrongAnswers: 0,
  setNumberOfWrongAnswers: (number) => set({ numberOfWrongAnswers: number }),
}));

export const useLesson = createSelectors(_useLesson);
