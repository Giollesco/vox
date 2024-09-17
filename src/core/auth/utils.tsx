import { createAccount } from '@/api/accounts/use-create-account';
import { getItem, removeItem, setItem } from '@/core/storage';
import { Account } from '@/types';

const TOKEN = 'user-token';

export type TokenType = string;

/**
 * Retrieves the authentication token stored in local storage.
 *
 * @returns {Promise<TokenType | null>} The stored token or null if it does not exist.
 */
export const getToken = () => getItem<TokenType>(TOKEN);

/**
 * Removes the authentication token from local storage.
 *
 * @returns {Promise<void>} Resolves when the token is removed.
 */
export const removeToken = () => removeItem(TOKEN);

/**
 * Stores the authentication token in local storage.
 *
 * @param {TokenType} value - The token value to be stored.
 * @returns {Promise<void>} Resolves when the token is stored.
 */
export const setToken = (value: TokenType) => setItem<TokenType>(TOKEN, value);

/**
 * Saves the user's details to the database.
 *
 * @async
 * @param {Partial<Account>} user - The user object containing the details to save.
 * @returns {Promise<Partial<Account> | null>} The saved user document or null on failure.
 */
export async function saveUserToDB(user: Partial<Account>) {
  try {
    // Step to save user data to your database collection
    const newUser = createAccount(user);

    // Return the newly created document in the database
    return newUser;
  } catch (error) {
    console.error('Error saving user to the database:', error);
    return null; // Handle errors and return null or error as needed
  }
}
