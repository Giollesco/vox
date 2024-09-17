import type { Account } from '@/types';

import { Collection, Database, database } from '../common';

export const createAccount = async (account: Partial<Account>) => {
  return await database.createDocument(
    Database.English, // Your database ID
    Collection.Accounts, // Your collection ID
    account.id as string, // Generate a unique document ID
    account // The account object to save
  );
};
