import { Env } from '@env';
import { Account, Client, Databases } from 'appwrite';

export const client = new Client();

client
  .setEndpoint(Env.EXPO_PUBLIC_API_URL)
  .setProject(Env.EXPO_PUBLIC_PROJECT_ID);

export const database = new Databases(client);
export const account = new Account(client);

// Enums
export enum Database {
  English = '660081b16487339cb8aa',
}

export enum Collection {
  Accounts = '66049181a16c209fdde3',
  Words = '660081c3f1907aaca711',
  AudioExercises = '66dda00400352539201f',
  Lessons = '66f6c7a90000596bfa8b',
  Games = '66f6c7ca0021e30ebd8f',
  GameOptions = '66f6cec00011dc07bc47',
}
