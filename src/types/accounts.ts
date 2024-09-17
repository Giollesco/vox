import { Models } from 'appwrite';
import { Onboarding } from './onboarding';

export type Account = Omit<Onboarding, 'steps'> & {
  id: string;
  completedAudioExercises: string[];
} & Models.Document;
