import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { setAudioExercises } from '@/stores';
import type { AudioExercise } from '@/types';

import { Collection, Database, database } from '../common';

type Response = AudioExercise[];
type Variables = void; // as react-query-kit is strongly typed, we need to specify the type of the variables as void in case we don't need them

export const useAudioExercises = createQuery<Response, Variables, AxiosError>({
  queryKey: ['audio-exercises'],
  fetcher: async () => {
    const response = await database.listDocuments(
      Database.English, // databaseId
      Collection.AudioExercises, // collectionId
      [] // queries (optional)
    );
    let exercises: AudioExercise[] =
      response.documents as unknown as AudioExercise[];
    setAudioExercises(exercises, response.total);
    return exercises;
  },
});
