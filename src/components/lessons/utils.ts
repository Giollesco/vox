import { Lesson, Level } from '@/types';

export default function getLessons(
  lessons: Lesson[],
  startingPoint: Level | undefined | null
): Lesson[] {
  /*
    { text: 'Potpuni sam početnik', level: Level.L1 },
    { text: 'Mogu voditi jednostavne razgovore', level: Level.L2 },
    { text: 'Govorim sa samopouzdanjem', level: Level.L3 },

    If the starting point is L1, return all lessons
    If the starting point is L2, return all lessons starting from lesson number: 2
    If the starting point is L3, return all lessons starting from lesson number: 3
  */

  if (!startingPoint) {
    return lessons;
  }

  const config: Record<Level, number> = {
    [Level.L1]: 0, // Return all lessons
    [Level.L2]: 1, // Skip first 1 lessons
    [Level.L3]: 2, // Skip first 2 lessons
  };

  return lessons.slice(config[startingPoint]);
}
