import type { Models } from 'appwrite';

import type { Onboarding } from './onboarding';

export type Account = Omit<Onboarding, 'steps'> & {
  id: string;
  completedAudioExercises: string[];
  completedLessons: string[];
} & Models.Document;
