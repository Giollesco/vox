import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import type { Account } from '@/types';

import { Collection, Database, database } from '../common';

type Variables = { accountId: string; completedLessons: string[] };
type Response = Account;

export const useFinishLesson = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) => {
    const response = await database.updateDocument(
      Database.English, // databaseId
      Collection.Accounts, // collectionId
      variables.accountId, // documentId
      { completedLessons: variables.completedLessons } // data
    );
    let account: Account = response.documents as unknown as Account;
    return account;
  },
});
