import { ID } from 'appwrite';
import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import type { OnboardingRequestForm } from '@/types';

import { Collection, Database, database } from '../common';

export const useAddAccount = createMutation<
  Response,
  OnboardingRequestForm,
  AxiosError
>({
  mutationFn: async (variables) => {
    const response = await database.createDocument(
      Database.English, // Your database ID
      Collection.Accounts, // Your collection ID
      ID.unique(), // Generate a unique ID for the document
      variables
    );

    // Return the created document as the response
    return response as any;
  },
});
