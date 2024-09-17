import { create } from 'zustand';

import { createSelectors } from '@/core';
import type {
  Language,
  Level,
  Onboarding,
  OnboardingRequestForm,
  Steps,
} from '@/types';

type OnboardingState = Onboarding & {
  setOnboarding: (onboarding: Onboarding) => void;
  getOnboarding: () => OnboardingRequestForm;
  updateFirstStep: ({
    firstName,
    lastName,
  }: {
    firstName: Onboarding['firstName'];
    lastName: Onboarding['lastName'];
  }) => void;
  updateSecondStep: (language: Language | null) => void;
  updateThirdStep: (startingPoint: Level | null) => void;
  updateFourthStep: (minutesPerDay: Level | null) => void;
  updateFifthStep: (interest: string) => void;
  updateSixthStep: (reminder: string) => void;
  updateSeventhStep: ({
    email,
    password,
  }: {
    email: Onboarding['email'];
    password: Onboarding['password'];
  }) => void;
  setSteps: (steps: Steps) => void;
};

const _useOnboarding = create<OnboardingState>((set, get) => ({
  // First step
  firstName: '',
  lastName: '',
  // Second step
  language: null,
  // Third step
  startingPoint: null,
  // Fourth step
  minutesPerDay: null,
  // Fifth step
  interests: [],
  // Sixth step
  reminder: '17:00h',
  // Seventh step
  email: '',
  password: '',
  steps: 0,
  setOnboarding: (onboarding) => set(onboarding),
  getOnboarding: (): OnboardingRequestForm => {
    const {
      firstName,
      lastName,
      language,
      startingPoint,
      minutesPerDay,
      interests,
      reminder,
      email,
    } = get();
    return {
      firstName,
      lastName,
      language,
      startingPoint,
      minutesPerDay,
      interests,
      reminder,
      email,
    } as OnboardingRequestForm;
  },
  updateFirstStep: ({ firstName, lastName }) => set({ firstName, lastName }),
  updateSecondStep: (language) => set({ language }),
  updateThirdStep: (startingPoint) => set({ startingPoint }),
  updateFourthStep: (minutesPerDay) => set({ minutesPerDay }),
  updateFifthStep: (interest) =>
    set((state) => {
      const interests = [...state.interests];
      const index = interests.indexOf(interest);
      if (index === -1) {
        interests.push(interest);
      } else {
        interests.splice(index, 1);
      }
      return { interests };
    }),
  updateSixthStep: (reminder) => set({ reminder }),
  updateSeventhStep: ({ email, password }) => set({ email, password }),
  setSteps: (steps) => set({ steps }),
}));

export const isNextStepEnabled = (
  steps: Steps,
  onboarding: OnboardingRequestForm
): boolean => {
  switch (steps) {
    case 1:
      return !!onboarding.firstName && !!onboarding.lastName;
    case 2:
      return !!onboarding.language;
    case 3:
      return !!onboarding.startingPoint;
    case 4:
      return !!onboarding.minutesPerDay;
    case 5:
      return onboarding.interests.length > 0;
    case 6:
      return !!onboarding.reminder;
    case 7:
      return !!onboarding.email && !!onboarding.password;
    default:
      return false;
  }
};

export const useOnboarding = createSelectors(_useOnboarding);
