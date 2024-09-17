import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { AudioExercise } from '@/types';
import { Collection, Database, database } from '../common';

type Variables = { id: string };
type Response = AudioExercise;

export const useAudioExercise = createQuery<Response, Variables, AxiosError>({
  queryKey: ['posts'],
  fetcher: async (variables) => {
    const response = await database.getDocument(
      Database.English, // databaseId
      Collection.AudioExercises, // collectionId
      variables.id,
      [] // queries (optional)
    );
    return response as any;
  },
});
