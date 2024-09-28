import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export function getItem<T>(key: string): T | null {
  const value = storage.getString(key);
  try {
    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.error('Error parsing JSON from storage:', e);
    return null;
  }
}

export function setItem<T>(key: string, value: T) {
  try {
    storage.set(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error stringifying value for storage:', e);
  }
}

export function removeItem(key: string) {
  storage.delete(key);
}
