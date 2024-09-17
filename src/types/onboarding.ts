import { Language, Level } from './';

export type Steps = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type Onboarding = {
  // First step
  firstName: string;
  lastName: string;
  // Second step
  language: Language | null;
  // Third step
  startingPoint: Level | null;
  // Fourth step
  minutesPerDay: Level | null;
  // Fifth step
  interests: string[];
  // Sixth step
  reminder: string;
  // Seventh step
  email: string;
  password: string;
  steps: Steps;
};

export type OnboardingRequestForm = Omit<Onboarding, 'steps'> & { id: string };
