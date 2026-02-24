import { MMKV } from 'react-native-mmkv';

// MMKV with the same ID automatically shares data via memory-mapped files.
// Multiple `new MMKV({ id })` calls point to the same mmap'd file on disk.
export const sharedStorage = new MMKV({ id: 'super-app-shared' });

/**
 * Promise-wrapped MMKV storage so it can be plugged into consumers
 * expecting an AsyncStorage-like interface (e.g., ScriptManager cache).
 */
export const MMKVStorage = {
  async getItem(key: string) {
    try {
      return sharedStorage.getString(key) ?? null;
    } catch (e) {
      return null;
    }
  },
  async setItem(key: string, value: string) {
    try {
      sharedStorage.set(key, value);
    } catch (e) {
      // ignore
    }
  },
  async removeItem(key: string) {
    try {
      sharedStorage.delete(key);
    } catch (e) {
      // ignore
    }
  },
  async clear() {
    try {
      sharedStorage.clearAll();
    } catch (e) {
      // ignore
    }
  },
};
