import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { setLessons } from '@/stores';
import type { Lesson } from '@/types';

import { Collection, Database, database } from '../common';
import { Query } from 'appwrite';

type Response = Lesson[];
type Variables = void; // as react-query-kit is strongly typed, we need to specify the type of the variables as void in case we don't need them

export const useLessons = createQuery<Response, Variables, AxiosError>({
  queryKey: ['lessons'],
  fetcher: async () => {
    const response = await database.listDocuments(
      Database.English, // databaseId
      Collection.Lessons, // collectionId
      [Query.orderAsc('index')]
    );
    let lessons = response.documents as Lesson[];
    setLessons(lessons);
    return lessons;
  },
});
