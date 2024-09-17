import type { Models } from 'appwrite';
import { create } from 'zustand';

import { account, Collection, Database, database } from '@/api';
import type { Account } from '@/types';

import { createSelectors } from '../utils';
import type { TokenType } from './utils';
import { getToken, removeToken, setToken } from './utils';

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  account: Account | null;
  token: TokenType | null;
  status: 'idle' | 'signOut' | 'signIn';
  setAccount: (account: Account) => void;
  signIn: (data: TokenType) => void;
  signOut: () => void;
  hydrate: () => void;
  updateAccount: (updatedAccount: Partial<Account>) => void;
}

const _useAuth = create<AuthState>((set, get) => ({
  user: null,
  account: null,
  status: 'signIn',
  token: null,
  setAccount: (account) => set({ account }),
  signIn: async (token) => {
    // Set token
    setToken(token);
    set({ status: 'signIn' as AuthState['status'], token });
    // Set user
    const user = await account.get();
    set({ user });
    // Set account
    let currentAccount = await database.getDocument(
      Database.English, // databaseId
      Collection.Accounts, // collectionId
      user.$id, // documentId
      [] // queries (optional)
    );
    set({ account: currentAccount as Account });
  },
  signOut: async () => {
    removeToken();
    set({ status: 'signOut', token: null, account: null, user: null });
    await account.deleteSessions();
  },
  hydrate: () => {
    try {
      const userToken = getToken();
      if (userToken !== null) {
        get().signIn(userToken);
      } else {
        get().signOut();
      }
    } catch (e) {
      get().signOut();
    }
  },
  updateAccount: (updatedAccount) => {
    const { account } = get();

    if (!account) {
      throw new Error('No account found to update.');
    }

    // Merge the new details with the existing account
    const updated = { ...account, ...updatedAccount };

    // Update the local state with the new account information
    set({ account: updated });
  },
}));

export const useAuth = createSelectors(_useAuth);

export const signOut = () => _useAuth.getState().signOut();
export const signIn = (token: TokenType) => _useAuth.getState().signIn(token);
export const hydrateAuth = () => _useAuth.getState().hydrate();
