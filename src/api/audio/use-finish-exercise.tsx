import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import type { Account } from '@/types';

import { Collection, Database, database } from '../common';

type Variables = { accountId: string; completedAudioExercises: string[] };
type Response = Account;

export const useFinishExercise = createMutation<
  Response,
  Variables,
  AxiosError
>({
  mutationFn: async (variables) => {
    const response = await database.updateDocument(
      Database.English, // databaseId
      Collection.Accounts, // collectionId
      variables.accountId, // documentId
      { completedAudioExercises: variables.completedAudioExercises } // data
    );
    let exercises: Account = response.documents as unknown as Account;
    return exercises;
  },
});
