import { create } from 'zustand';

import { createSelectors } from '@/core/utils';
import type { AudioExercise } from '@/types';

type OnboardingState = {
  audioExercises: {
    total: number;
    exercises: AudioExercise[];
  };
  setAudioExercises: (exercises: AudioExercise[], total: number) => void;
};

const _useAudioExercises = create<OnboardingState>((set, get) => ({
  audioExercises: {
    total: 0,
    exercises: [],
  },
  setAudioExercises: (exercises: AudioExercise[], total: number) =>
    set((state) => ({
      audioExercises: {
        total,
        exercises,
      },
    })),
}));

export const useAudioExercises = createSelectors(_useAudioExercises);
// For setting state inside hooks
export const getAudioExercises = () =>
  useAudioExercises.getState().audioExercises;
export const setAudioExercises = (exercises: AudioExercise[], total: number) =>
  useAudioExercises.getState().setAudioExercises(exercises, total);
