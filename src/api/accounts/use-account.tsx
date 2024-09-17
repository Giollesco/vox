import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import type { Account } from '@/types';

import { Collection, Database, database } from '../common';

type Response = Account;
type Variables = { $id: string };

export const useAccount = createQuery<Response, Variables, AxiosError>({
  queryKey: ['account'],
  fetcher: async (variables) => {
    const response = await database.getDocument(
      Database.English, // databaseId
      Collection.Accounts, // collectionId
      variables.$id,
      [] // queries (optional)
    );
    console.log('DEV-LOG ~ fetcher: ~ account:', response);
    let account: Account = response as unknown as Account;
    return account;
  },
});
